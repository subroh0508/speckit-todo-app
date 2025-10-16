# speckit-todo Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-16

## Active Technologies

### 001-browser-todo-app: Browser-Based ToDo Application
- **Frontend**: React 18+ with TypeScript, Vite
- **Backend**: Node.js 20 LTS with TypeScript, Express.js
- **Database**: PostgreSQL 14+ with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Testing**: Vitest + Playwright (frontend), Jest + Supertest (backend)
- **State Management**: TanStack Query
- **Validation**: Zod

## Project Structure

```
backend/
├── src/
│   ├── models/          # User, Task entities
│   ├── services/        # Business logic
│   ├── api/            # REST API endpoints
│   ├── auth/           # Authentication middleware
│   └── db/             # Database configuration
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
└── config/

frontend/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Page components
│   ├── services/       # API client
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utilities
├── tests/
│   ├── unit/
│   └── integration/
└── public/
```

## Commands

### Backend
```bash
cd backend
npm install              # Install dependencies
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npm run dev             # Start dev server
npm test                # Run tests
```

### Frontend
```bash
cd frontend
npm install             # Install dependencies
npm run dev            # Start dev server
npm test               # Run unit tests
npm run test:e2e       # Run E2E tests
```

### Database
```bash
docker-compose up -d    # Start PostgreSQL
npx prisma studio      # Open database GUI
```

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: ESLint + Prettier
- **Naming**: camelCase for variables, PascalCase for components/classes
- **API**: RESTful conventions, versioned endpoints (/api/v1)
- **Testing**: Test-driven development approach
- **Security**: bcrypt for passwords, JWT for auth, parameterized queries

## Key Constraints

- Task text: 1-200 characters
- Password: minimum 8 chars, must contain uppercase, lowercase, and number
- JWT token expiry: 7 days
- Performance target: <500ms UI response time
- Authentication required for all task operations

## Recent Changes
- 001-browser-todo-app: Added Browser-Based ToDo Application with React + Express + PostgreSQL

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
