/**
 * API Type Definitions for Browser-Based ToDo Application
 *
 * Generated from OpenAPI specification
 * Version: 1.0.0
 */

// ============================================================================
// Domain Models
// ============================================================================

/**
 * User entity
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email: string;
  /** Account creation timestamp */
  createdAt: string;
}

/**
 * Task entity
 */
export interface Task {
  /** Unique task identifier */
  id: string;
  /** Task description (1-200 characters) */
  text: string;
  /** Task completion status */
  completed: boolean;
  /** Task creation timestamp */
  createdAt: string;
  /** Task completion timestamp (null if not completed) */
  completedAt: string | null;
}

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * Request body for user registration
 */
export interface RegisterRequest {
  /** User's email address (must be unique) */
  email: string;
  /**
   * User's password. Must contain:
   * - At least 8 characters
   * - At least 1 uppercase letter
   * - At least 1 lowercase letter
   * - At least 1 number
   */
  password: string;
}

/**
 * Request body for user login
 */
export interface LoginRequest {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Response from authentication endpoints (/auth/register, /auth/login)
 */
export interface AuthResponse {
  /** Authenticated user information */
  user: User;
  /** JWT token for authentication (expires in 7 days) */
  token: string;
}

/**
 * Request body for creating a new task
 */
export interface CreateTaskRequest {
  /** Task description (1-200 characters) */
  text: string;
}

/**
 * Response from GET /tasks endpoint
 */
export interface GetTasksResponse {
  /** List of active (incomplete) tasks */
  tasks: Task[];
}

/**
 * Response from POST /tasks/{taskId}/complete endpoint
 */
export interface CompleteTaskResponse {
  /** Success message */
  message: string;
  /** ID of the completed task */
  taskId: string;
}

/**
 * Standard error response
 */
export interface ErrorResponse {
  /** Human-readable error message */
  error: string;
  /** Machine-readable error code */
  code: string;
  /** Additional error details (optional) */
  details?: Record<string, any>;
}

// ============================================================================
// Error Codes
// ============================================================================

/**
 * Standard error codes used by the API
 */
export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_EXISTS = 'EMAIL_EXISTS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Resource errors
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// ============================================================================
// Validation Schemas (for use with Zod or similar)
// ============================================================================

/**
 * Validation constraints for API inputs
 */
export const ValidationRules = {
  email: {
    maxLength: 255,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    minLength: 8,
    maxLength: 100,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  },
  taskText: {
    minLength: 1,
    maxLength: 200,
    pattern: /\S/, // Must contain at least one non-whitespace character
  },
} as const;

// ============================================================================
// API Client Types
// ============================================================================

/**
 * Configuration for API client
 */
export interface ApiClientConfig {
  /** Base URL for API requests */
  baseUrl: string;
  /** JWT token for authentication (optional) */
  token?: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
}

/**
 * API client interface
 */
export interface ApiClient {
  // Auth endpoints
  register(data: RegisterRequest): Promise<AuthResponse>;
  login(data: LoginRequest): Promise<AuthResponse>;
  getCurrentUser(): Promise<User>;

  // Task endpoints
  getTasks(): Promise<GetTasksResponse>;
  createTask(data: CreateTaskRequest): Promise<Task>;
  completeTask(taskId: string): Promise<CompleteTaskResponse>;
}

// ============================================================================
// Frontend State Types
// ============================================================================

/**
 * Authentication state for frontend
 */
export interface AuthState {
  /** Currently authenticated user (null if not logged in) */
  user: User | null;
  /** JWT token (null if not logged in) */
  token: string | null;
  /** Whether authentication is being checked/performed */
  isLoading: boolean;
  /** Authentication error (null if no error) */
  error: string | null;
}

/**
 * Task list state for frontend
 */
export interface TasksState {
  /** List of active tasks */
  tasks: Task[];
  /** Whether tasks are being loaded */
  isLoading: boolean;
  /** Error loading tasks (null if no error) */
  error: string | null;
}

// ============================================================================
// HTTP Types
// ============================================================================

/**
 * HTTP methods supported by API
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Standard HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}
