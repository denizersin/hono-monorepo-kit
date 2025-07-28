import { TErrorResponse } from '@repo/api-client'
import '@tanstack/react-query'
import { TQueryKey } from '@web/hooks/queries'


type TCustomResponseError = Error | TErrorResponse

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: TCustomResponseError
        mutationMeta: {
            invalidates?: Array<TQueryKey>
            invalidateAndAwait?: Array<TQueryKey>
            
        }
    }

}