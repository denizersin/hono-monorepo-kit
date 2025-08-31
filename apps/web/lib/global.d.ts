import '@tanstack/react-query'
import { TQueryKey } from '@/hooks/rest-queries'
import { TErrorResponse } from '@repo/backend/exports'
import { TTrpcErrorServer } from '@repo/backend/exports'


type TCustomResponseError = Error | TErrorResponse | TTrpcErrorServer

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: TCustomResponseError
        mutationMeta: {
            invalidates?: Array<TQueryKey>
            invalidateAndAwait?: Array<TQueryKey>

        }
    }

}