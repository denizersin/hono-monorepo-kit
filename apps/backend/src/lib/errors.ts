import { Context } from 'hono'
import { SahredEnums } from '@repo/shared/enums'
import { TErrorCode } from '@repo/shared/types'


type AppErrorParams = {
    message: string
    code: string
    errorCode: TErrorCode
    statusCode?: number
    details?: any
    toast?: boolean
}

export class AppError extends Error {
    public code: string
    public errorCode: TErrorCode
    public statusCode: number
    public details?: any
    public toast?: boolean

    constructor({
        message,
        code,
        errorCode,
        statusCode = 400,
        details,
        toast
    }: AppErrorParams) {
        super(message)
        this.name = 'AppError'
        this.message = message
        this.code = code
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.details = details
        this.toast = toast
    }
}

export class ValidationError extends AppError {
    constructor({ message, details, toast }: { message: string; details?: any; toast?: boolean }) {
        super({
            message,
            code: 'VALIDATION_ERROR',
            errorCode: 'VALIDATION_ERROR',
            statusCode: 400,
            details,
            toast
        })
        this.name = 'ValidationError'
    }
}

export class AuthenticationError extends AppError {
    constructor({ message = 'Authentication failed', toast }: { message?: string; toast?: boolean } = {}) {
        super({
            message,
            code: 'AUTHENTICATION_ERROR',
            errorCode: 'AUTHENTICATION_ERROR',
            statusCode: 401,
            toast
        })
        this.name = 'AuthenticationError'
    }
}

export class AuthorizationError extends AppError {
    constructor({ message = 'Not authorized', toast }: { message?: string; toast?: boolean } = {}) {
        super({
            message,
            code: 'AUTHORIZATION_ERROR',
            errorCode: 'AUTHORIZATION_ERROR',
            statusCode: 403,
            toast
        })
        this.name = 'AuthorizationError'
    }
}

export class NotFoundError extends AppError {
    constructor({ message = 'Resource not found', toast }: { message?: string; toast?: boolean } = {}) {
        super({
            message,
            code: 'NOT_FOUND_ERROR',
            errorCode: 'NOT_FOUND_ERROR',
            statusCode: 404,
            toast
        })
        this.name = 'NotFoundError'
    }
}

export class ConflictError extends AppError {
    constructor({ message, details, toast }: { message: string; details?: any; toast?: boolean }) {
        super({
            message,
            code: 'CONFLICT_ERROR',
            errorCode: 'CONFLICT_ERROR',
            statusCode: 409,
            details,
            toast
        })
        this.name = 'ConflictError'
    }
}

export class InternalServerError extends AppError {
    constructor({ message = 'Internal server error', toast }: { message?: string; toast?: boolean } = {}) {
        super({
            message,
            code: 'INTERNAL_SERVER_ERROR',
            errorCode: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
            toast
        })
        this.name = 'InternalServerError'
    }
}

export class CustomError extends AppError {
    constructor({ message, errorCode='BAD_REQUEST', statusCode = SahredEnums.STATUS_CODES.BAD_REQUEST, details, toast }: { 
        message: string; 
        errorCode?: TErrorCode; 
        statusCode?: number; 
        details?: any; 
        toast?: boolean 
    }) {
        super({
            message,
            code: errorCode,
            errorCode,
            statusCode,
            details,
            toast
        })
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
        toast?: boolean
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
        errorCode: error.errorCode,
        toast: error.toast
    }))
})

export const createSuccessResponse = <T>(data: T): TSuccessResponse<T> => ({
    success: true,
    data
})

export const handleAppError = (c: Context, error: unknown) => {
    if (error instanceof AppError) {
        return c.json(createErrorResponse([error]), error.statusCode as 400 | 401 | 403 | 404 | 409 | 500)
    }

    if (error instanceof Error) {
        return c.json(createErrorResponse([
            new InternalServerError({ message: error.message })
        ]), 500)
    }

    return c.json(createErrorResponse([
        new InternalServerError({ message: 'An unknown error occurred' })
    ]), 500)
} 