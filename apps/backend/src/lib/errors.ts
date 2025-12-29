import { Context } from 'hono'
import { SahredEnums } from '@repo/shared/enums'
import { TErrorCode } from '@repo/shared/types'
import { TRPC_ERROR_CODE_KEY, TRPCError } from '@trpc/server'
import logger from './logger'
import { ZodError, ZodIssue } from 'zod'


type AppErrorParams2 = {
    message?: string
    code: string
    errorCode: TErrorCode
    statusCode?: number
    details?: {
        zodErrors?: ZodIssue[]
    }
    toast?: boolean
    isFromTrpcErrorInstance: boolean
}


type AppErrorParams={
    message: string
    code: string
    errorCode: TErrorCode
    statusCode: number
    details?: {
        zodErrors?: ZodIssue[]
    }
    toast?: boolean
    isFromTrpcErrorInstance: boolean
}

export class AppError extends Error {
    public code: string
    public errorCode: TErrorCode
    public statusCode: number
    public details?: any
    public toast?: boolean
    public name: string
    public message: string
    public isFromTrpcErrorInstance: boolean
    constructor({
        message,
        code,
        errorCode,
        statusCode = 400,
        details,
        toast,
        isFromTrpcErrorInstance = false
    }: AppErrorParams) {
        super(message)
        this.name = 'AppError'
        this.message = message ?? 'An unknown error occurred'
        this.code = code
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.details = details
        this.toast = toast
        this.isFromTrpcErrorInstance = isFromTrpcErrorInstance
    }
}

export class BadRequestError extends AppError {
    constructor(data?: Partial<AppErrorParams>) {
        super({
            message: data?.message ?? 'Bad Request',
            code: SahredEnums.STATUS_CODES.BAD_REQUEST,
            errorCode: SahredEnums.STATUS_CODES.BAD_REQUEST,
            statusCode: SahredEnums.STATUS_CODE_IDS.BAD_REQUEST,
            details: data?.details,
            toast: data?.toast,
            isFromTrpcErrorInstance: data?.isFromTrpcErrorInstance ?? false
        })
        this.name = 'BadRequestError'
    }
}

export class UnauthorizedError extends AppError {
    constructor(data?: Partial<AppErrorParams>) {
        super({
            message: data?.message ?? 'You are not authorized to access this resource',
            code: SahredEnums.STATUS_CODES.UNAUTHORIZED,
            errorCode: SahredEnums.STATUS_CODES.UNAUTHORIZED,
            statusCode: SahredEnums.STATUS_CODE_IDS.UNAUTHORIZED,
            toast: data?.toast,
            details: data?.details,
            isFromTrpcErrorInstance: data?.isFromTrpcErrorInstance ?? false
        })
        this.name = 'UnauthorizedError'
    }
}

export class ForbiddenError extends AppError {
    constructor(data?: Partial<AppErrorParams>) {
        super({
            message: data?.message ?? 'Forbidden',
            code: SahredEnums.STATUS_CODES.FORBIDDEN,
            errorCode: SahredEnums.STATUS_CODES.FORBIDDEN,
            statusCode: SahredEnums.STATUS_CODE_IDS.FORBIDDEN,
            toast: data?.toast,
            details: data?.details,
            isFromTrpcErrorInstance: data?.isFromTrpcErrorInstance ?? false
        })
        this.name = 'ForbiddenError'
    }
}

export class NotFoundError extends AppError {
    constructor(data?: Partial<AppErrorParams>) {
        super({
            message: data?.message ?? 'Not Found',
            code: SahredEnums.STATUS_CODES.NOT_FOUND,
            errorCode: SahredEnums.STATUS_CODES.NOT_FOUND,
            statusCode: SahredEnums.STATUS_CODE_IDS.NOT_FOUND,
            toast: data?.toast,
            details: data?.details,
            isFromTrpcErrorInstance: data?.isFromTrpcErrorInstance ?? false
        })
        this.name = 'NotFoundError'
    }
}

export class ConflictError extends AppError {
    constructor(data?: Partial<AppErrorParams>) {
        super({
            message: data?.message ?? 'Conflict',
            code: SahredEnums.STATUS_CODES.CONFLICT,
            errorCode: SahredEnums.STATUS_CODES.CONFLICT,
            statusCode: SahredEnums.STATUS_CODE_IDS.CONFLICT,
            toast: data?.toast,
            details: data?.details,
            isFromTrpcErrorInstance: data?.isFromTrpcErrorInstance ?? false
        })
        this.name = 'ConflictError'
    }
}

export class InternalServerError extends AppError {
    constructor(data?: Partial<AppErrorParams>) {
        super({
            message: data?.message ?? 'Internal Server Error',
            code: SahredEnums.STATUS_CODES.INTERNAL_SERVER_ERROR,
            errorCode: SahredEnums.STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusCode: SahredEnums.STATUS_CODE_IDS.INTERNAL_SERVER_ERROR,
            toast: data?.toast,
            details: data?.details,
            isFromTrpcErrorInstance: data?.isFromTrpcErrorInstance ?? false
        })
        this.name = 'InternalServerError'
    }
}

export class CustomError extends AppError {
    constructor(data?: Partial<AppErrorParams>) {
        super({
            message: data?.message ?? 'An unknown error occurred'   ,
            code: data?.code ?? SahredEnums.STATUS_CODES.INTERNAL_SERVER_ERROR,
            errorCode: data?.errorCode ?? SahredEnums.STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusCode: data?.statusCode ?? SahredEnums.STATUS_CODE_IDS.INTERNAL_SERVER_ERROR,
            details: data?.details,
            toast: data?.toast,
            isFromTrpcErrorInstance: data?.isFromTrpcErrorInstance ?? false
        })
        this.name = 'CustomError'
    }
}

export type TErrorResponse = {
    success: false
    errors: Array<AppErrorParams>
}

export type TSuccessResponse<T = any> = {
    success: true
    data: T
}

export type TApiResponse<T = any> = TErrorResponse | TSuccessResponse<T>

export const createErrorResponse = (errors: AppError[]): TErrorResponse => ({
    success: false,
    errors: errors.map(error => createError(error))
})

export const createError = (error: AppError): TErrorResponse['errors'][number] => ({
    message: error.message ?? 'An unknown error occurred',
    code: error.code,
    details: error.details,
    errorCode: error.errorCode,
    toast: error.toast,
    isFromTrpcErrorInstance: error.isFromTrpcErrorInstance ?? false,
    statusCode: error.statusCode ?? SahredEnums.STATUS_CODE_IDS.INTERNAL_SERVER_ERROR
})

export const createSuccessResponse = <T>(data: T): TSuccessResponse<T> => ({
    success: true,
    data
})

export const handleAppError = (c: Context, error: unknown) => {
    

    console.log('error', error)

    if (error instanceof AppError) {
        return c.json(createErrorResponse([error]), error.statusCode as 400 | 401 | 403 | 404 | 409 | 500)
    }


    if (error instanceof ZodError) {
        return c.json(createErrorResponse([
            new BadRequestError({
                message: error.message + ' unique error code:', details: {
                    zodErrors: error.errors
                },
                toast: true
            })
        ]), 400)
    }


    //handle unknown errors. return an uniqe code for the error then look for the error in the logs

    let errorCode = +Math.floor(Math.random() * 1000000)
    logger.error('unknown error errorCode:' + errorCode, error)




    if (error instanceof Error) {
        return c.json(createErrorResponse([
            new InternalServerError({ message: error.message + ' unique error code:' + errorCode })
        ]), SahredEnums.STATUS_CODE_IDS.INTERNAL_SERVER_ERROR)
    }


    return c.json(createErrorResponse([
        new InternalServerError({ message: 'An unknown error occurred' + ' unique error code:' + errorCode })
    ]), SahredEnums.STATUS_CODE_IDS.INTERNAL_SERVER_ERROR)
}



export const createTRPCError = ({ code, data }: {
    code: TRPC_ERROR_CODE_KEY,
    data?: Partial<AppErrorParams>
}) => {

    let error: AppError

    if (data) {
        data.isFromTrpcErrorInstance = true
    }

    if (code === 'UNAUTHORIZED') {
        error = new UnauthorizedError(data)
    }
    else if (code === 'FORBIDDEN') {
        error = new ForbiddenError(data)
    }
    else if (code === 'NOT_FOUND') {
        error = new NotFoundError(data)
    }
    else if (code === 'INTERNAL_SERVER_ERROR') {
        error = new InternalServerError(data)
    }

    else if (code === 'BAD_REQUEST') {
        error = new BadRequestError(data)
    }
    else if (code === 'CONFLICT') {
        error = new ConflictError(data)
    }

    else {
        error = new InternalServerError({ message: data?.message, toast: data?.toast, isFromTrpcErrorInstance: true })
    }





    //trpc error is alreadyn an insatnce of error so the cause should'nt be an instance of error
    let errorAsObject = Object.assign({}, error)

    return new TRPCError({
        message: error.message ?? 'An unknown error occurred',
        code,
        cause: {
            customData: errorAsObject
        }
    })
}


export const TRPC_ERROR_CODES_BY_KEY = {
    /**
     * Invalid JSON was received by the server.
     * An error occurred on the server while parsing the JSON text.
     */
    PARSE_ERROR: -32700,
    /**
     * The JSON sent is not a valid Request object.
     */
    BAD_REQUEST: -32600, // 400
  
    // Internal JSON-RPC error
    INTERNAL_SERVER_ERROR: -32603, // 500
    NOT_IMPLEMENTED: -32603, // 501
    BAD_GATEWAY: -32603, // 502
    SERVICE_UNAVAILABLE: -32603, // 503
    GATEWAY_TIMEOUT: -32603, // 504
  
    // Implementation specific errors
    UNAUTHORIZED: -32001, // 401
    PAYMENT_REQUIRED: -32002, // 402
    FORBIDDEN: -32003, // 403
    NOT_FOUND: -32004, // 404
    METHOD_NOT_SUPPORTED: -32005, // 405
    TIMEOUT: -32008, // 408
    CONFLICT: -32009, // 409
    PRECONDITION_FAILED: -32012, // 412
    PAYLOAD_TOO_LARGE: -32013, // 413
    UNSUPPORTED_MEDIA_TYPE: -32015, // 415
    UNPROCESSABLE_CONTENT: -32022, // 422
    TOO_MANY_REQUESTS: -32029, // 429
    CLIENT_CLOSED_REQUEST: -32099, // 499
  } as const;