import { MutationOptions, queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { clientWithType } from "@web/lib/api-client"
import { TCustomResponseError } from "@web/lib/global"
import { setToLocalStorage } from "@web/lib/utils"
import type { InferRequestType, InferResponseType } from 'hono/client'



const authQueryOptions = queryOptions({
    queryKey: [clientWithType.auth["get-session"].$url().pathname],
    queryFn: async () => {
        const response = await clientWithType.auth["get-session"].$get()
        const data = await response.json()
        if (!response.ok) throw data
        return data
    },
    select: (data) => data.data,
    staleTime: Infinity
})

export const useAuthQuery = () => {
    return useQuery({
        ...authQueryOptions,
    })
}

type TLoginRequest = InferRequestType<typeof clientWithType.auth.login.$post>['json']
type TLoginResponse = InferResponseType<typeof clientWithType.auth.login.$post>

export const useLoginMutation = (options?: MutationOptions<TLoginResponse, TCustomResponseError, TLoginRequest>) => {

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: TLoginRequest) => {
            const response = await clientWithType.auth.login.$post({ json: data })
            const responseData = await response.json()
            if (!response.ok) throw responseData
            return responseData
        },
        ...options,
        onSuccess: (data, variables, context) => {
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context)
            }
            queryClient.invalidateQueries({ queryKey: [clientWithType.auth["get-session"].$url().pathname] })
        },
        onError: (error, variables, context) => {
            if (options?.onError) {
                options.onError(error, variables, context)
            }
        }
    })
}


type TRegisterRequest = InferRequestType<typeof clientWithType.auth.register.$post>['json']
type TRegisterResponse = InferResponseType<typeof clientWithType.auth.register.$post>

export const useRegisterMutation = (options?: MutationOptions<TRegisterResponse, TCustomResponseError, TRegisterRequest>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: TRegisterRequest) => {
            const response = await clientWithType.auth.register.$post({ json: data })
            const responseData = await response.json()
            if (!response.ok) throw responseData
            return responseData
        },
        ...options,
        onSuccess: (data, variables, context) => {
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context)
            }
            queryClient.invalidateQueries({ queryKey: [clientWithType.auth["get-session"].$url().pathname] })
        },
        onError: (error, variables, context) => {
            if (options?.onError) {
                options.onError(error, variables, context)
            }
        }
    })
}


export const useLogoutMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            await clientWithType.auth.logout.$post()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [clientWithType.auth["get-session"].$url().pathname] })
        }
    })
}