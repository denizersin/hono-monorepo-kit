import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { isErrorResponse } from "@web/lib/utils"
import { toast } from "react-toastify"

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,

        },
    },
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (isErrorResponse(error)) {
                error.errors.forEach(err => {
                    if (!err.toast) return
                    toast(err.message, {
                        type: 'error'
                    })
                })
            }
            // console.log('query', query)
            // console.log('error', error)
        }
    }),
    mutationCache: new MutationCache({
        onError(error, variables, context, mutation) {
            console.log('error', error)
            console.log('variables', variables)
            console.log('context', context)
            console.log('mutation', mutation)
            if (isErrorResponse(error)) {
                error.errors.forEach(err => {
                    if (!err.toast) return
                    toast(err.message, {
                        type: 'error'
                    })
                })
            }
        },
    })
})


export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}