import { queryOptions, type UseQueryOptions } from '@tanstack/react-query'
import { clientWithType } from '@web/lib/api-client'
export const QUERY_KEYS = {
    USER_ME:clientWithType.user.me.$url().pathname,
    GET_SESSION:clientWithType.auth["get-session"].$url().pathname,

    //CONSTANTS
    COUNTRIES:clientWithType.constants.countries.$url().pathname
} as const

export const _baseQueryOptions:Omit<UseQueryOptions,'queryKey' | 'queryFn'>={
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
}


export const baseQueryOptions=(options:UseQueryOptions)=>{
    return queryOptions({
        ..._baseQueryOptions,
        ...options
    })
}
