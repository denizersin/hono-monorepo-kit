import { Context } from 'hono'
type TErrorCode = 'VALIDATION_ERROR' | 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR' | 'NOT_FOUND_ERROR' | 'CONFLICT_ERROR' | 'INTERNAL_SERVER_ERROR' | 'CUSTOM_ERROR_CODE1'
export class AppError extends Error {
    constructor(
        public message: string,
        public code: string,
        public errorCode: TErrorCode,
        public statusCode: number = 400,
        public details?: any
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 'VALIDATION_ERROR', 'VALIDATION_ERROR', 400, details)
        this.name = 'ValidationError'
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(message, 'AUTHENTICATION_ERROR', 'AUTHENTICATION_ERROR', 401)
        this.name = 'AuthenticationError'
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Not authorized') {
        super(message, 'AUTHORIZATION_ERROR', 'AUTHORIZATION_ERROR', 403)
        this.name = 'AuthorizationError'
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 'NOT_FOUND_ERROR', 'NOT_FOUND_ERROR', 404)
        this.name = 'NotFoundError'
    }
}

export class ConflictError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 'CONFLICT_ERROR', 'CONFLICT_ERROR', 409, details)
        this.name = 'ConflictError'
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(message, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR', 500)
        this.name = 'InternalServerError'
    }
}

export class CustomError extends AppError {
    constructor(message: string, errorCode: TErrorCode, statusCode: number = 400, details?: any) {
        super(message, errorCode, errorCode, statusCode, details)
        this.name = 'CustomError'
    }
}

export type TErrorResponse = {
    success: false
    errors: Array<{
        message: string
        code: string
        details?: any
        errorCode: TErrorCode
    }>
}

export type TSuccessResponse<T = any> = {
    success: true
    data: T
}

export type TApiResponse<T = any> = TErrorResponse | TSuccessResponse<T>

export const createErrorResponse = (errors: AppError[]): TErrorResponse => ({
    success: false,
    errors: errors.map(error => ({
        message: error.message,
        code: error.code,
        details: error.details,
        errorCode: error.errorCode
    }))
})

export const createSuccessResponse = <T>(data: T): TSuccessResponse<T> => ({
    success: true,
    data
})

export const handleError = (c: Context, error: unknown) => {
    if (error instanceof AppError) {
        return c.json(createErrorResponse([error]), error.statusCode as 400 | 401 | 403 | 404 | 409 | 500)
    }

    if (error instanceof Error) {
        return c.json(createErrorResponse([
            new InternalServerError(error.message)
        ]), 500)
    }

    return c.json(createErrorResponse([
        new InternalServerError('An unknown error occurred')
    ]), 500)
} 