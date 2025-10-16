# Technology Research: Browser-Based ToDo Application

**Feature**: 001-browser-todo-app
**Date**: 2025-10-16
**Purpose**: Resolve NEEDS CLARIFICATION items from Technical Context

---

## Research Areas

### 1. Frontend Technology Stack

**Decision**: React 18+ with TypeScript

**Rationale**:
- **TypeScript**: Provides type safety, catches errors at compile time, excellent IDE support
- **React**: Most widely adopted frontend framework, large ecosystem, excellent documentation
- **Why React over Vue/Svelte**:
  - Larger community and job market (easier maintenance)
  - Mature ecosystem for auth, state management, testing
  - Excellent TypeScript support
  - Component composition model fits task list UI well

**Alternatives Considered**:
- **Vue 3**: Good TypeScript support, but smaller ecosystem
- **Svelte**: Smallest bundle size, but less mature ecosystem for enterprise features like auth
- **Vanilla JS**: Would require building too much infrastructure from scratch

**Dependencies**:
- `react` + `react-dom`: Core framework
- `vite`: Build tool (faster than Create React App)
- `react-router-dom`: Client-side routing
- `@tanstack/react-query`: Server state management and caching
- `zod`: Runtime validation (forms, API responses)

---

### 2. Backend Technology Stack

**Decision**: Node.js with TypeScript + Express.js

**Rationale**:
- **Shared Language**: TypeScript for both frontend and backend reduces context switching
- **Express.js**: Minimal, flexible, well-documented
- **Performance**: Node.js handles I/O-bound operations efficiently (perfect for CRUD API)
- **Ecosystem**: Excellent libraries for auth (Passport.js, JWT), validation, testing

**Alternatives Considered**:
- **Python + FastAPI**: Excellent for APIs, but different language from frontend
- **Go**: Great performance, but steeper learning curve and different language
- **Java/Spring Boot**: Enterprise-grade but overkill for this scale

**Dependencies**:
- `express`: Web framework
- `typescript`: Type safety
- `prisma`: Type-safe ORM
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT token generation/validation
- `express-validator`: Request validation
- `cors`: Cross-origin resource sharing

---

### 3. Database Selection

**Decision**: PostgreSQL 14+

**Rationale**:
- **Relational Model**: Perfect fit for User-Task one-to-many relationship
- **Data Integrity**: ACID compliance ensures 99.9% reliability requirement
- **JSON Support**: Can store additional task metadata in future if needed
- **Performance**: Excellent for read-heavy workloads (viewing task lists)
- **Open Source**: No licensing costs, large community

**Alternatives Considered**:
- **MySQL**: Similar features, but PostgreSQL has better JSON support and standards compliance
- **SQLite**: Too limited for multi-device sync requirements
- **MongoDB**: NoSQL overkill for simple relational data model

**Schema Approach**:
- Use Prisma ORM for type-safe database access
- Migrations managed through Prisma Migrate
- Indexes on: `tasks.user_id`, `users.email`

---

### 4. Authentication Strategy

**Decision**: JWT-based authentication with email/password (OAuth2 as future enhancement)

**Rationale**:
- **JWT Tokens**: Stateless, work well with cross-device sync, easy to implement
- **Email/Password First**: Simplest MVP, users understand it, no external dependencies
- **OAuth2 Later**: Can add Google/GitHub OAuth in future without breaking existing auth
- **Security**: bcrypt for password hashing (10 rounds), HTTP-only cookies for token storage

**Flow**:
1. User registers: email + password → hashed password stored
2. User logs in: credentials verified → JWT token returned
3. Token stored in HTTP-only cookie (XSS protection)
4. Token included in API requests via Authorization header
5. Token expires after 7 days (configurable)

**Alternatives Considered**:
- **Session-based auth**: Requires server-side session storage, harder to scale
- **OAuth2 only**: Adds external dependency, more complex for MVP
- **Magic links**: Good UX but requires email infrastructure

---

### 5. Testing Strategy

**Decision**: Multi-layer testing approach

**Frontend Testing**:
- **Unit Tests**: Vitest + React Testing Library
  - Component logic, hooks, utility functions
  - Fast, isolated tests
- **Integration Tests**: Playwright
  - End-to-end user flows
  - Cross-browser testing (Chrome, Firefox, Safari)

**Backend Testing**:
- **Unit Tests**: Jest + Supertest
  - Service layer logic
  - API endpoints
- **Contract Tests**: Pact or OpenAPI validation
  - Ensure API matches documented contracts
- **Integration Tests**: Jest + Test Database
  - Full request/response cycle with real database

**Rationale**:
- **Vitest**: Vite-native, fast, compatible with Jest API
- **Jest**: Industry standard for Node.js
- **Playwright**: Modern, reliable, supports multiple browsers
- **Supertest**: Best tool for Express.js API testing

**Alternatives Considered**:
- **Cypress**: Good but heavier than Playwright, slower test execution
- **Testing Library alone**: Need E2E tests for full confidence

---

### 6. Development and Deployment Best Practices

**Development Environment**:
- Docker Compose for local PostgreSQL
- Environment variables for configuration (.env files)
- Hot reload for both frontend (Vite HMR) and backend (nodemon)

**Code Quality**:
- ESLint + Prettier for code formatting
- TypeScript strict mode
- Pre-commit hooks (Husky + lint-staged)

**CI/CD** (Future):
- GitHub Actions for automated testing
- Deployment to Vercel (frontend) + Railway/Render (backend)

---

## Technology Matrix Summary

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| Frontend Framework | React | 18+ | Ecosystem maturity, TypeScript support |
| Frontend Language | TypeScript | 5+ | Type safety, developer experience |
| Frontend Build | Vite | 5+ | Fast builds, modern tooling |
| Backend Framework | Express.js | 4.18+ | Flexibility, simplicity |
| Backend Language | Node.js + TypeScript | 20 LTS | Shared language with frontend |
| Database | PostgreSQL | 14+ | Reliability, ACID compliance |
| ORM | Prisma | 5+ | Type safety, excellent DX |
| Authentication | JWT + bcrypt | Latest | Stateless, secure |
| Frontend Testing | Vitest + Playwright | Latest | Speed and reliability |
| Backend Testing | Jest + Supertest | Latest | Industry standard |
| State Management | TanStack Query | 5+ | Server state caching |
| Validation | Zod | 3+ | Type-safe validation |

---

## Performance Considerations

**Frontend Optimizations**:
- Code splitting with React.lazy()
- Memoization for task list rendering
- Debounced input validation
- Optimistic UI updates for task operations

**Backend Optimizations**:
- Database connection pooling
- Query optimization with proper indexes
- Response compression (gzip)
- Rate limiting to prevent abuse

**Target Metrics**:
- Initial page load: < 2 seconds
- Task operations (add/complete): < 500ms
- API response time: < 200ms (p95)

---

## Security Considerations

**Frontend**:
- XSS prevention via React's built-in escaping
- CSRF protection via SameSite cookies
- Input validation with Zod schemas
- Content Security Policy headers

**Backend**:
- Password hashing with bcrypt (10 rounds)
- JWT secret stored in environment variables
- SQL injection prevention via Prisma parameterized queries
- Rate limiting on auth endpoints
- CORS configuration for trusted origins only
- Helmet.js for security headers

---

## Open Questions Resolved

| Original Question | Resolution |
|-------------------|------------|
| Frontend language/framework | TypeScript + React 18 |
| Backend language/framework | TypeScript + Node.js + Express |
| Database choice | PostgreSQL 14+ |
| Authentication method | JWT with email/password |
| Frontend testing | Vitest + Playwright |
| Backend testing | Jest + Supertest |

---

## Next Steps

With all technology choices finalized, proceed to:
1. ✅ **Phase 1**: Define data models (data-model.md)
2. ✅ **Phase 1**: Design API contracts (contracts/)
3. ✅ **Phase 1**: Create quickstart guide (quickstart.md)
