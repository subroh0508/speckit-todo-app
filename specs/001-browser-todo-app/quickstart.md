# Quick Start Guide: Browser-Based ToDo Application

**Feature**: 001-browser-todo-app
**Last Updated**: 2025-10-16

This guide will help you set up and run the Browser-Based ToDo Application locally for development.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Common Issues](#common-issues)
9. [Next Steps](#next-steps)

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 20 LTS or higher ([Download](https://nodejs.org/))
- **npm**: Version 10+ (comes with Node.js)
- **Docker**: For running PostgreSQL locally ([Download](https://www.docker.com/))
- **Git**: For version control ([Download](https://git-scm.com/))

**Verify installations**:
```bash
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
docker --version # Should show Docker version 20.x.x or higher
```

---

## Project Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd speckit-todo
   ```

2. **Checkout the feature branch**:
   ```bash
   git checkout 001-browser-todo-app
   ```

3. **Install dependencies** for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install

   # Return to project root
   cd ..
   ```

---

## Database Setup

1. **Start PostgreSQL with Docker Compose**:

   Create a `docker-compose.yml` file in the project root:
   ```yaml
   version: '3.8'

   services:
     postgres:
       image: postgres:14-alpine
       container_name: todo-app-db
       environment:
         POSTGRES_USER: todouser
         POSTGRES_PASSWORD: todopass
         POSTGRES_DB: todoapp
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

   Start the database:
   ```bash
   docker-compose up -d
   ```

2. **Verify database is running**:
   ```bash
   docker ps
   # Should show todo-app-db container running
   ```

3. **Set up environment variables**:

   Create `backend/.env` file:
   ```env
   # Database
   DATABASE_URL="postgresql://todouser:todopass@localhost:5432/todoapp"

   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"

   # Server
   PORT=3000
   NODE_ENV=development

   # CORS
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Run database migrations**:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

   This will create the `users` and `tasks` tables.

5. **Verify database schema**:
   ```bash
   npx prisma studio
   ```
   This opens a browser-based database viewer at `http://localhost:5555`.

---

## Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Build TypeScript** (optional for development):
   ```bash
   npm run build
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   The backend API will be available at `http://localhost:3000`.

5. **Verify backend is running**:
   ```bash
   curl http://localhost:3000/api/v1/health
   # Should return: {"status":"ok"}
   ```

---

## Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Create environment variables**:

   Create `frontend/.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

4. **Open in browser**:
   ```
   http://localhost:5173
   ```

---

## Running the Application

### Development Mode (Recommended)

Run both frontend and backend simultaneously:

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

**Terminal 3 - Database** (if not already running):
```bash
docker-compose up
```

### Using a Process Manager (Alternative)

Install `concurrently` to run all services from one terminal:

```bash
npm install -g concurrently
```

Create `package.json` in project root:
```json
{
  "name": "todo-app",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev"
  }
}
```

Then run:
```bash
npm run dev
```

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests (requires app to be running)
npm run test:e2e
```

### Manual Testing

1. **Register a new user**:
   - Go to `http://localhost:5173`
   - Click "Register"
   - Enter email and password
   - Should redirect to task list

2. **Create tasks**:
   - Enter task text (max 200 chars)
   - Click "Add Task" or press Enter
   - Task should appear in list

3. **Complete tasks**:
   - Click checkbox or "Complete" button on a task
   - Task should disappear from list

4. **Test persistence**:
   - Refresh page → tasks should remain
   - Log out and log back in → tasks should remain
   - Open in different browser → log in → same tasks appear

---

## Common Issues

### Database Connection Errors

**Problem**: `Error: P1001: Can't reach database server`

**Solutions**:
1. Ensure Docker is running: `docker ps`
2. Check if PostgreSQL container is running: `docker ps | grep todo-app-db`
3. Restart container: `docker-compose restart`
4. Verify DATABASE_URL in `backend/.env`

---

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
1. Find process using port: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)
2. Kill process: `kill -9 <PID>` (Mac/Linux) or `taskkill /PID <PID> /F` (Windows)
3. Or change port in `backend/.env`: `PORT=3001`

---

### JWT Token Errors

**Problem**: `401 Unauthorized` errors when making API requests

**Solutions**:
1. Verify JWT_SECRET is set in `backend/.env`
2. Log out and log back in to get fresh token
3. Check browser console for token-related errors
4. Clear browser localStorage: `localStorage.clear()`

---

### Prisma Migration Issues

**Problem**: `Error: Schema file not found`

**Solutions**:
1. Ensure you're in `backend/` directory
2. Run `npx prisma generate`
3. Reset database if needed: `npx prisma migrate reset`

---

### Frontend Build Errors

**Problem**: TypeScript type errors after pulling latest changes

**Solutions**:
1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart dev server

---

## Next Steps

### For Developers

1. **Read the full specification**: [spec.md](spec.md)
2. **Review API contracts**: [contracts/openapi.yaml](contracts/openapi.yaml)
3. **Study data models**: [data-model.md](data-model.md)
4. **Check implementation plan**: [plan.md](plan.md)
5. **Review technology choices**: [research.md](research.md)

### Development Tasks

Run `/speckit.tasks` to generate the implementation task list.

### Deployment

For production deployment:
1. Set up environment variables on hosting platform
2. Use production DATABASE_URL
3. Generate strong JWT_SECRET
4. Configure CORS for production frontend URL
5. Enable HTTPS
6. Set up database backups
7. Configure monitoring and logging

### Additional Features

See "Out of Scope" section in [spec.md](spec.md) for features that could be added later:
- Task editing
- Task priorities and due dates
- Search and filtering
- Data export
- OAuth2 authentication
- Mobile apps

---

## Resources

- **React Documentation**: https://react.dev/
- **Express.js Documentation**: https://expressjs.com/
- **Prisma Documentation**: https://www.prisma.io/docs/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Vite Documentation**: https://vitejs.dev/

---

## Getting Help

- Check [Common Issues](#common-issues) section above
- Review error messages carefully
- Search existing GitHub issues
- Ask in team chat or create new GitHub issue
- Consult feature documentation in `specs/001-browser-todo-app/`

---

**Happy Coding! 🚀**
