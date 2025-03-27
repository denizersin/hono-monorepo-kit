import { TErrorResponse } from '@repo/api-client'
import '@tanstack/react-query'


type TCustomResponseError = Error | TErrorResponse

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: TCustomResponseError
    }
}