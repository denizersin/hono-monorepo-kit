import { type MutationOptions, queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { clientWithType } from "@/lib/api-client"
import type { TCustomResponseError } from "@/lib/global"
import type { InferRequestType, InferResponseType } from 'hono/client'
import { MUTATION_KEYS, QUERY_KEYS } from ".."



export const authQueryOptions = queryOptions({
    queryKey: [QUERY_KEYS.GET_SESSION],
    queryFn: async () => {
        const response = await clientWithType.auth["get-session"].$get()
        const data = await response.json()
        if (!response.ok) throw data
        return data
    },
    select: (data) => data.data,
    staleTime: Infinity,
})



export const useRestSession = () => {
    const query = useQuery({
        ...authQueryOptions,
    })

    const isLoading = query.isLoading || query.isPending
    const isError = query.isError
    const isAuthenticated = !isLoading && !isError && query.data

    return {
        isLoading,
        isError,
        isAuthenticated,
        session: query.data
    }
}




type TLoginRequest = InferRequestType<typeof clientWithType.auth.login.$post>['json']
type TLoginResponse = InferResponseType<typeof clientWithType.auth.login.$post>

export const useLoginMutation = (options?: MutationOptions<TLoginResponse, TCustomResponseError, TLoginRequest>) => {

    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['login'],
        mutationFn: async (data: TLoginRequest) => {
            const response = await clientWithType.auth.login.$post({ json: data })
            const responseData = await response.json()
            if (!response.ok) throw responseData
            return responseData
        },
        ...options,
        onSuccess: (data, variables, onMutateResult, context) => {
            if (options?.onSuccess) {
                options.onSuccess(data, variables, onMutateResult, context)
            }
            if (data.data.session.user.isPhoneVerified) {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SESSION] })
            }
        },
    })
}


type TRegisterRequest = InferRequestType<typeof clientWithType.auth.register.$post>['json']
type TRegisterResponse = InferResponseType<typeof clientWithType.auth.register.$post>

export const useRegisterMutation = (options?: MutationOptions<TRegisterResponse, TCustomResponseError, TRegisterRequest>) => {
    return useMutation({
        mutationFn: async (data: TRegisterRequest) => {
            const response = await clientWithType.auth.register.$post({ json: data })
            const responseData = await response.json()
            if (!response.ok) throw responseData
            return responseData
        },
        meta: { invalidates: [QUERY_KEYS.GET_SESSION] },
        ...options,
        onSuccess: (data, variables, onMutateResult, context) => {
            if (options?.onSuccess) {
                options.onSuccess(data, variables, onMutateResult, context)
            }
            // queryClient.invalidateQueries({queryKey:[QUERY_KEYS.GET_SESSION]})
        },

    })
}


export const useLogoutMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            await clientWithType.auth.logout.$post()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SESSION] })
        },
        mutationKey: [MUTATION_KEYS.LOGOUT]
    })
}
const fn = clientWithType.auth["verify-code"].$post
type TVerifyCodeRequest = InferRequestType<typeof fn>['json']
type TVerifyCodeResponse = InferResponseType<typeof fn>

export const useVerifyCodeMutation = (options?: MutationOptions<TVerifyCodeResponse, TCustomResponseError, TVerifyCodeRequest>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: TVerifyCodeRequest) => {
            const response = await clientWithType.auth["verify-code"].$post({ json: data })
            const responseData = await response.json()
            if (!response.ok) throw responseData
            return responseData
        },
        ...options,
        onSuccess: (data, variables, onMutateResult, context) => {
            if (options?.onSuccess) {
                options.onSuccess(data, variables, onMutateResult, context)
            }
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SESSION] })
        },
        onError: (error, variables, onMutateResult, context) => {
            if (options?.onError) {
                options.onError(error, variables, onMutateResult, context)
            }
        }
    })
}

