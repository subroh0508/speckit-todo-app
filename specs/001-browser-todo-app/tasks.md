# Tasks: Browser-Based ToDo Application

**Input**: Design documents from `/specs/001-browser-todo-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not included in this task list (can be added later if TDD approach is desired)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions
- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend directory structure (src/models, src/services, src/api, src/auth, src/db, tests/)
- [ ] T002 Create frontend directory structure (src/components, src/pages, src/services, src/hooks, src/utils, tests/)
- [ ] T003 [P] Initialize backend: Node.js + TypeScript + Express project in backend/
- [ ] T004 [P] Initialize frontend: Vite + React + TypeScript project in frontend/
- [ ] T005 [P] Install backend dependencies (express, prisma, bcrypt, jsonwebtoken, zod, cors, express-validator)
- [ ] T006 [P] Install frontend dependencies (react, react-router-dom, @tanstack/react-query, zod, axios)
- [ ] T007 [P] Configure TypeScript strict mode for backend in backend/tsconfig.json
- [ ] T008 [P] Configure TypeScript strict mode for frontend in frontend/tsconfig.json
- [ ] T009 [P] Setup ESLint + Prettier for backend in backend/
- [ ] T010 [P] Setup ESLint + Prettier for frontend in frontend/
- [ ] T011 Create docker-compose.yml for PostgreSQL database
- [ ] T012 Create backend/.env.example with required environment variables
- [ ] T013 Create frontend/.env.example with VITE_API_BASE_URL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Setup

- [ ] T014 Create Prisma schema in backend/prisma/schema.prisma with User and Task models
- [ ] T015 Initialize Prisma and generate client in backend/
- [ ] T016 Create initial database migration for users and tasks tables
- [ ] T017 Setup database connection and error handling in backend/src/db/connection.ts

### Backend Infrastructure

- [ ] T018 [P] Create API router structure in backend/src/api/index.ts
- [ ] T019 [P] Setup Express app with middleware (cors, json parser, error handler) in backend/src/app.ts
- [ ] T020 [P] Create error handling middleware in backend/src/middleware/errorHandler.ts
- [ ] T021 [P] Create validation schemas using Zod in backend/src/utils/validation.ts
- [ ] T022 Create JWT utility functions (generate, verify) in backend/src/utils/jwt.ts
- [ ] T023 Create authentication middleware in backend/src/auth/middleware.ts
- [ ] T024 Create server entry point in backend/src/index.ts

### Frontend Infrastructure

- [ ] T025 [P] Setup React Router in frontend/src/App.tsx
- [ ] T026 [P] Configure TanStack Query provider in frontend/src/main.tsx
- [ ] T027 [P] Create API client base configuration in frontend/src/services/api.ts
- [ ] T028 [P] Create authentication context/hook in frontend/src/hooks/useAuth.tsx
- [ ] T029 [P] Create protected route component in frontend/src/components/ProtectedRoute.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 4 - User Authentication and Task Persistence (Priority: P1) 🎯 FOUNDATIONAL

**Goal**: Enable users to create accounts, log in, and have their data persisted across sessions and devices

**Independent Test**: Create an account, log out, log back in from different browser - user should see their data

**Why First**: All other user stories depend on authentication. Without this, tasks cannot be saved or associated with users.

### Backend - User Model & Service

- [ ] T030 [P] [US4] Implement User model types in backend/src/models/user.ts
- [ ] T031 [US4] Implement UserService with register method in backend/src/services/userService.ts
- [ ] T032 [US4] Implement UserService with login method in backend/src/services/userService.ts
- [ ] T033 [US4] Implement UserService with findById method in backend/src/services/userService.ts
- [ ] T034 [US4] Add password hashing (bcrypt) utilities in backend/src/utils/password.ts

### Backend - Auth API Endpoints

- [ ] T035 [US4] Implement POST /auth/register endpoint in backend/src/api/auth.ts
- [ ] T036 [US4] Implement POST /auth/login endpoint in backend/src/api/auth.ts
- [ ] T037 [US4] Implement GET /auth/me endpoint in backend/src/api/auth.ts
- [ ] T038 [US4] Add input validation for auth endpoints using Zod schemas
- [ ] T039 [US4] Add error handling for duplicate email (409), invalid credentials (401)

### Frontend - Auth UI & Logic

- [ ] T040 [P] [US4] Create Register page component in frontend/src/pages/Register.tsx
- [ ] T041 [P] [US4] Create Login page component in frontend/src/pages/Login.tsx
- [ ] T042 [US4] Implement auth service functions (register, login, getCurrentUser) in frontend/src/services/authService.ts
- [ ] T043 [US4] Implement useAuth hook with login/register/logout logic in frontend/src/hooks/useAuth.tsx
- [ ] T044 [US4] Add form validation (email format, password strength) in frontend/src/utils/validation.ts
- [ ] T045 [US4] Add token storage and retrieval (localStorage) in frontend/src/utils/storage.ts
- [ ] T046 [US4] Implement authentication state persistence across page refreshes
- [ ] T047 [US4] Add loading states and error handling for auth operations

**Checkpoint**: Users can register, login, and stay authenticated across sessions

---

## Phase 4: User Story 1 & 3 - Add and View Tasks (Priority: P1) 🎯 MVP CORE

**Combined Goal**: Users can add tasks and see them displayed in a list

**Why Combined**: These stories are tightly coupled - adding a task requires viewing it immediately (US1 acceptance scenario #1)

**Independent Test**: Log in, add task "Buy groceries", verify it appears in list. Refresh page, task still visible.

### Backend - Task Model & Service

- [ ] T048 [P] [US1] [US3] Implement Task model types in backend/src/models/task.ts
- [ ] T049 [US1] Implement TaskService with createTask method in backend/src/services/taskService.ts
- [ ] T050 [US3] Implement TaskService with getUserTasks method (filters completed=false) in backend/src/services/taskService.ts
- [ ] T051 [US1] Add task text validation (1-200 chars, not only whitespace) in TaskService

### Backend - Task API Endpoints

- [ ] T052 [US1] Implement POST /tasks endpoint in backend/src/api/tasks.ts
- [ ] T053 [US3] Implement GET /tasks endpoint in backend/src/api/tasks.ts
- [ ] T054 [US1] [US3] Add authentication middleware to task endpoints
- [ ] T055 [US1] [US3] Add input validation and error handling for task endpoints

### Frontend - Task UI Components

- [ ] T056 [P] [US1] Create TaskForm component (input + submit button) in frontend/src/components/TaskForm.tsx
- [ ] T057 [P] [US3] Create TaskList component (displays tasks) in frontend/src/components/TaskList.tsx
- [ ] T058 [P] [US3] Create TaskItem component (single task display) in frontend/src/components/TaskItem.tsx
- [ ] T059 [P] [US3] Create EmptyState component (shown when no tasks) in frontend/src/components/EmptyState.tsx

### Frontend - Task Logic & Integration

- [ ] T060 [US1] Implement task service with createTask function in frontend/src/services/taskService.ts
- [ ] T061 [US3] Implement task service with getTasks function in frontend/src/services/taskService.ts
- [ ] T062 [US1] [US3] Create useTasks hook with TanStack Query in frontend/src/hooks/useTasks.tsx
- [ ] T063 [US1] Implement optimistic UI updates for task creation in useTasks hook
- [ ] T064 [US1] Add client-side validation (prevent empty submission, 200 char limit) in TaskForm
- [ ] T065 [US1] [US3] Create main TasksPage component integrating TaskForm + TaskList in frontend/src/pages/TasksPage.tsx
- [ ] T066 [US1] [US3] Add loading states for task list fetching
- [ ] T067 [US1] [US3] Add error handling and error messages for task operations

**Checkpoint**: Users can add tasks via form, see them in a list, and list persists across refreshes. MVP is functional!

---

## Phase 5: User Story 2 - Complete and Remove Task (Priority: P2)

**Goal**: Users can mark tasks as complete, removing them from the visible list

**Independent Test**: Pre-populate task list, click "Complete" on a task, verify it disappears immediately

### Backend - Task Completion

- [ ] T068 [US2] Implement TaskService with completeTask method in backend/src/services/taskService.ts
- [ ] T069 [US2] Add validation: ensure task belongs to authenticated user before completing
- [ ] T070 [US2] Add validation: prevent completing already-completed tasks (idempotency)
- [ ] T071 [US2] Implement POST /tasks/:taskId/complete endpoint in backend/src/api/tasks.ts
- [ ] T072 [US2] Add error handling for task not found (404)

### Frontend - Task Completion UI

- [ ] T073 [US2] Add complete button/checkbox to TaskItem component in frontend/src/components/TaskItem.tsx
- [ ] T074 [US2] Implement completeTask function in frontend/src/services/taskService.ts
- [ ] T075 [US2] Add completeTask mutation to useTasks hook with optimistic updates
- [ ] T076 [US2] Implement immediate UI removal of completed tasks (optimistic update)
- [ ] T077 [US2] Add confirmation/undo option (optional) for accidental completions
- [ ] T078 [US2] Add loading state for completion action (button disabled during request)
- [ ] T079 [US2] Handle errors for completion failures (revert optimistic update)

**Checkpoint**: Users can complete tasks with immediate visual feedback. All P1 and P2 stories complete!

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall quality

### UI/UX Enhancements

- [ ] T080 [P] Add loading spinner component in frontend/src/components/Loading.tsx
- [ ] T081 [P] Add error message component in frontend/src/components/ErrorMessage.tsx
- [ ] T082 [P] Improve form UX (Enter key to submit, auto-focus, clear after submit)
- [ ] T083 [P] Add empty state messages ("No tasks yet! Add your first task")
- [ ] T084 [P] Add success feedback for task creation (toast/flash message)
- [ ] T085 [P] Improve responsive design for mobile browsers
- [ ] T086 [P] Add task count display ("5 tasks")

### Performance & Optimization

- [ ] T087 [P] Add React.memo to TaskItem component to prevent unnecessary re-renders
- [ ] T088 [P] Optimize TanStack Query cache settings (staleTime, cacheTime)
- [ ] T089 [P] Add request debouncing for rapid task additions
- [ ] T090 [P] Implement connection pooling configuration for Prisma
- [ ] T091 [P] Add compression middleware to Express (gzip)

### Security & Error Handling

- [ ] T092 [P] Add rate limiting to auth endpoints (express-rate-limit)
- [ ] T093 [P] Add Helmet.js for security headers in backend
- [ ] T094 [P] Implement proper CORS configuration in backend
- [ ] T095 [P] Add request logging middleware (morgan or winston)
- [ ] T096 [P] Implement global error boundary in frontend
- [ ] T097 [P] Add session expiry handling (redirect to login on 401)

### Edge Cases (from spec.md)

- [ ] T098 [P] Handle text longer than 200 chars (truncate with "..." or prevent input)
- [ ] T099 [P] Test special characters and emoji in task text (ensure proper encoding)
- [ ] T100 [P] Prevent double-click on complete button (debounce/disable)
- [ ] T101 [P] Handle offline scenarios (show error message "No internet connection")
- [ ] T102 [P] Handle session expiry gracefully (redirect to login with message)

### Documentation & Development Experience

- [ ] T103 [P] Add API documentation comments (JSDoc) to all service methods
- [ ] T104 [P] Create README.md with setup instructions in repository root
- [ ] T105 [P] Validate quickstart.md instructions work from scratch
- [ ] T106 [P] Add inline code comments for complex logic
- [ ] T107 [P] Create sample .env files with all required variables documented

### Code Quality

- [ ] T108 [P] Run ESLint and fix all warnings/errors
- [ ] T109 [P] Run Prettier and format all code
- [ ] T110 [P] Remove console.log statements from production code
- [ ] T111 [P] Add TypeScript strict null checks and fix issues
- [ ] T112 [P] Review and remove unused imports and variables

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - start immediately ✅
2. **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories ⚠️
3. **User Story 4 (Phase 3)**: Depends on Foundational - BLOCKS all other stories ⚠️
4. **User Stories 1+3 (Phase 4)**: Depends on US4 completion - MVP Core 🎯
5. **User Story 2 (Phase 5)**: Depends on US1+3 completion (needs tasks to complete)
6. **Polish (Phase 6)**: Depends on all desired user stories being complete

### Critical Path

```
Setup → Foundational → US4 (Auth) → US1+3 (Add/View Tasks) → US2 (Complete) → Polish
```

### User Story Independence

- **US4 (Auth)**: Must be first - all others depend on it ⚠️
- **US1+3 (Add/View)**: Can start after US4 - Combined as MVP core
- **US2 (Complete)**: Can start after US1+3 - Needs existing tasks to complete

### Parallel Opportunities

**Within Phase 1 (Setup)**:
- All [P] tasks can run in parallel (T003-T013)

**Within Phase 2 (Foundational)**:
- Database setup (T014-T017) must be sequential
- Backend infrastructure [P] tasks can run together (T018-T021)
- Frontend infrastructure [P] tasks can run together (T025-T029)

**Within Phase 3 (US4)**:
- Backend models [P] can run parallel: T030, T034
- Frontend UI pages [P] can run parallel: T040, T041

**Within Phase 4 (US1+3)**:
- Backend models [P] can run parallel: T048
- All frontend UI components [P] can run parallel: T056-T059

**Within Phase 5 (US2)**:
- Frontend UI updates can run parallel with backend once backend is complete

**Within Phase 6 (Polish)**:
- Almost all tasks are [P] and can run in parallel

---

## Parallel Example: User Story 4 (Authentication)

```bash
# Step 1: Backend models (parallel)
Task: T030 - Implement User model types
Task: T034 - Add password hashing utilities

# Step 2: Backend services (sequential on T030, T034)
Task: T031 - UserService.register
Task: T032 - UserService.login
Task: T033 - UserService.findById

# Step 3: Backend API (sequential on services)
Task: T035-T039 - Auth endpoints

# Step 4: Frontend UI (parallel, independent of each other)
Task: T040 - Register page
Task: T041 - Login page

# Step 5: Frontend logic (sequential on T040, T041)
Task: T042-T047 - Auth service, hooks, validation, storage
```

---

## Implementation Strategy

### MVP First: US4 + US1+3 Only (Recommended)

**Goal**: Ship working product with core value ASAP

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational (critical path)
3. ✅ Complete Phase 3: US4 - Authentication (critical path)
4. ✅ Complete Phase 4: US1+3 - Add & View Tasks (core MVP)
5. 🎉 **STOP and VALIDATE**: Test full user journey independently
6. 🚀 Deploy MVP (users can register, add tasks, view tasks)
7. 📈 Gather feedback before building US2

**MVP Scope**: T001-T067 (67 tasks)

### Full Feature: Add US2 (Complete Tasks)

1. Complete MVP (T001-T067)
2. ✅ Complete Phase 5: US2 - Complete Tasks
3. 🎉 **VALIDATE**: Test completion flow independently
4. 🚀 Deploy full feature set

**Full Scope**: T001-T079 (79 tasks)

### Production Ready: Add Polish

1. Complete Full Feature (T001-T079)
2. ✅ Complete Phase 6: Polish & Cross-Cutting
3. 🎉 **VALIDATE**: Run quickstart.md end-to-end
4. 🚀 Deploy production-ready application

**Production Scope**: T001-T112 (112 tasks)

### Incremental Delivery Timeline

| Milestone | Tasks | Stories Delivered | User Value |
|-----------|-------|-------------------|------------|
| Infrastructure | T001-T029 | None (foundation) | None yet |
| MVP | T001-T067 | US4, US1, US3 | Can add and view tasks 🎯 |
| Full Feature | T001-T079 | +US2 | Can complete tasks ✅ |
| Production | T001-T112 | +Polish | Production ready 🚀 |

---

## Task Summary

**Total Tasks**: 112

**By Phase**:
- Phase 1 (Setup): 13 tasks
- Phase 2 (Foundational): 16 tasks (⚠️ blocks all stories)
- Phase 3 (US4 - Auth): 18 tasks (⚠️ blocks US1-3)
- Phase 4 (US1+3 - Add/View): 20 tasks (🎯 MVP core)
- Phase 5 (US2 - Complete): 12 tasks
- Phase 6 (Polish): 33 tasks

**By Priority**:
- P1 (Critical Path): T001-T067 (67 tasks) → MVP
- P2 (Core Feature): T068-T079 (12 tasks) → Full Feature
- Polish (Production): T080-T112 (33 tasks) → Production Ready

**Parallel Tasks**: 52 tasks marked [P] can run in parallel within their phase

**Estimated Timeline** (1 developer, 8 hours/day):
- MVP (67 tasks): ~2-3 weeks
- Full Feature (79 tasks): ~3-4 weeks
- Production (112 tasks): ~4-5 weeks

---

## Notes

- [P] = Different files, no dependencies, can run in parallel
- [US#] = Maps task to specific user story for traceability
- Each user story should be independently testable at its checkpoint
- Commit after each task or logical group of [P] tasks
- Stop at any checkpoint to validate story works independently
- MVP (US4 + US1 + US3) is the recommended first delivery target
- Phase 2 (Foundational) MUST complete before any user story work begins
- Phase 3 (US4 - Auth) MUST complete before US1-3 can work
