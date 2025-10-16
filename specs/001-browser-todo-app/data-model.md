# Data Model: Browser-Based ToDo Application

**Feature**: 001-browser-todo-app
**Date**: 2025-10-16
**Database**: PostgreSQL 14+
**ORM**: Prisma 5+

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (PK)             │
│ email               │
│ password_hash       │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
┌─────────────────────┐
│       Task          │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ text                │
│ completed           │
│ created_at          │
│ completed_at        │
└─────────────────────┘
```

---

## Entity Definitions

### User

Represents an authenticated user of the application.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Auto-generated | Unique user identifier |
| `email` | String(255) | Unique, Not Null, Index | User's email address for login |
| `password_hash` | String(255) | Not Null | bcrypt-hashed password |
| `created_at` | Timestamp | Not Null, Default: NOW() | Account creation timestamp |
| `updated_at` | Timestamp | Not Null, Auto-update | Last account update timestamp |

**Indexes**:
- `PRIMARY KEY (id)`
- `UNIQUE INDEX idx_users_email ON users(email)`

**Validation Rules** (enforced at application layer):
- Email must be valid format (RFC 5322)
- Email must be unique (case-insensitive)
- Password minimum 8 characters before hashing
- Password must contain: 1 uppercase, 1 lowercase, 1 number

**Business Rules**:
- User deletion cascades to all associated tasks
- Email cannot be changed after account creation (MVP constraint)
- Password can be changed via separate endpoint (requires old password)

---

### Task

Represents a single ToDo item belonging to a user.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Auto-generated | Unique task identifier |
| `user_id` | UUID | Foreign Key (User.id), Not Null, Index | Owner of this task |
| `text` | String(200) | Not Null | Task description |
| `completed` | Boolean | Not Null, Default: false | Completion status |
| `created_at` | Timestamp | Not Null, Default: NOW() | Task creation timestamp |
| `completed_at` | Timestamp | Nullable | When task was completed |

**Indexes**:
- `PRIMARY KEY (id)`
- `INDEX idx_tasks_user_id ON tasks(user_id)`
- `INDEX idx_tasks_user_completed ON tasks(user_id, completed)` (composite for filtering)

**Foreign Keys**:
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`

**Validation Rules** (enforced at application layer):
- Text must be 1-200 characters
- Text must not be only whitespace
- Completed tasks cannot be uncompleted (one-way transition)
- completed_at must be set when completed=true

**Business Rules**:
- Completed tasks (completed=true) are excluded from GET /tasks queries
- Once completed=true, task cannot be modified (immutable)
- Tasks soft-deleted by setting completed=true (actual row deletion happens asynchronously)

---

## State Transitions

### Task Lifecycle

```
┌─────────┐
│ Created │ ─────────────────────────────┐
└────┬────┘                              │
     │                                   │
     │ User views task                   │
     │ (no state change)                 │
     │                                   │
     ▼                                   │
┌─────────┐                              │
│  Active │                              │
└────┬────┘                              │
     │                                   │
     │ User marks complete               │
     │ (completed=true,                  │
     │  completed_at=NOW())              │
     │                                   │
     ▼                                   │
┌───────────┐                            │
│ Completed │ ◄──────────────────────────┘
└───────────┘
     │
     │ (Not visible in UI,
     │  eligible for deletion)
```

**State Rules**:
- Tasks are created with `completed=false`, `completed_at=NULL`
- Transition to completed is irreversible within the feature scope
- Completed tasks are logically deleted (hidden from queries)

---

## Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique @db.VarChar(255)
  passwordHash  String   @map("password_hash") @db.VarChar(255)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  tasks         Task[]

  @@index([email])
  @@map("users")
}

model Task {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  text        String    @db.VarChar(200)
  completed   Boolean   @default(false)
  createdAt   DateTime  @default(now()) @map("created_at")
  completedAt DateTime? @map("completed_at")

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, completed])
  @@map("tasks")
}
```

---

## Query Patterns

### Common Queries

**Get all active tasks for a user**:
```sql
SELECT id, text, created_at
FROM tasks
WHERE user_id = $1 AND completed = false
ORDER BY created_at DESC;
```

**Create new task**:
```sql
INSERT INTO tasks (id, user_id, text, completed, created_at)
VALUES ($1, $2, $3, false, NOW())
RETURNING id, text, created_at;
```

**Mark task as completed**:
```sql
UPDATE tasks
SET completed = true, completed_at = NOW()
WHERE id = $1 AND user_id = $2 AND completed = false
RETURNING id;
```

**Get user by email (for login)**:
```sql
SELECT id, email, password_hash
FROM users
WHERE email = $1;
```

**Create new user**:
```sql
INSERT INTO users (id, email, password_hash, created_at, updated_at)
VALUES ($1, $2, $3, NOW(), NOW())
RETURNING id, email, created_at;
```

---

## Performance Considerations

### Indexing Strategy

1. **Primary lookups**: UUID primary keys for fast point queries
2. **User auth**: Index on `users.email` for login lookups
3. **Task filtering**: Composite index on `(user_id, completed)` for active task queries
4. **Foreign key**: Index on `tasks.user_id` for joins and cascading deletes

### Query Optimization

- Use `SELECT` with specific columns (avoid `SELECT *`)
- Limit result sets (pagination for large task lists in future)
- Use connection pooling (Prisma default: 10 connections)
- Prepared statements via Prisma (SQL injection prevention)

### Estimated Storage

- **User**: ~1 KB per user (email + hash + metadata)
- **Task**: ~300 bytes per task (UUID + text + timestamps)
- **1000 users × 100 tasks**: ~30 MB (excluding indexes)
- **Indexes overhead**: ~20% of raw data size

---

## Data Integrity Rules

### Database Constraints

1. **Referential Integrity**: `tasks.user_id` → `users.id` with CASCADE delete
2. **Uniqueness**: `users.email` must be unique
3. **Not Null**: All non-nullable fields enforced at DB level
4. **Check Constraints** (future enhancement):
   ```sql
   ALTER TABLE tasks ADD CONSTRAINT check_text_length
   CHECK (LENGTH(text) > 0 AND LENGTH(text) <= 200);
   ```

### Application-Level Validation

- Email format validation (Zod schema)
- Password strength validation (regex + length)
- Task text length validation (1-200 chars)
- Completed task immutability (check before UPDATE)

---

## Migration Strategy

### Initial Migration

```sql
-- Migration: 001_create_users_and_tasks

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text VARCHAR(200) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
```

### Rollback Plan

```sql
-- Rollback: 001_create_users_and_tasks

DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

---

## Future Enhancements (Out of Scope for MVP)

- **Task editing**: Add `updated_at` timestamp, allow text modification
- **Task archiving**: Soft delete with `deleted` boolean instead of `completed`
- **Task metadata**: Add `priority`, `due_date`, `tags` columns
- **Task ordering**: Add `position` integer for custom ordering
- **User profiles**: Add `name`, `avatar_url` to users table
- **Session tracking**: Separate `sessions` table for active JWT tokens
- **Audit log**: `task_history` table to track all changes

---

## Data Retention Policy

**MVP Approach**:
- Completed tasks remain in database indefinitely
- No automatic cleanup (future: archive after 30 days)

**Future Considerations**:
- Archive completed tasks older than 30 days to separate table
- GDPR compliance: User deletion removes all associated data (already handled by CASCADE)
- Backup strategy: Daily snapshots, 30-day retention
