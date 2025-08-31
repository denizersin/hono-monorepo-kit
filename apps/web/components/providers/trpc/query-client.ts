import {
    QueryClient,
    defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import superjson from "superjson";

import { MutationCache, QueryCache } from "@tanstack/react-query";
import { isErrorResponse, isTRPCError } from "@/lib/utils";
import { toast } from "react-toastify";
import { MUTATION_KEYS, QUERY_KEYS } from "@/hooks/rest-queries";



export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: false,
                experimental_prefetchInRender: true,
            },
            dehydrate: {
                serializeData: superjson.serialize,
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === "pending",
            },
            hydrate: {
                deserializeData: superjson.deserialize,
            },

        
        },
        
        queryCache: new QueryCache({
            onError: (error, query) => {
                if (isErrorResponse(error)) {
                    error.errors.forEach(err => {
                        if (!err.toast) return;
                        toast(err.message, {
                            type: 'error'
                        });
                    });
                }
                if (isTRPCError(error)) {
                    if (error.data?.causeData?.toast) {
                        toast(error.data.causeData.message, {
                            type: 'error'
                        });
                    }
                    if (error.data?.zodError?.fieldErrors) {
                        // toast(error.data.zodError.formErrors.join(', '), {
                        //     type: 'error'
                        // });
                    }
                }

                // console.log('query', query)
                // console.log('error', error)
            }
        }),
        mutationCache: new MutationCache({
            onError(error, variables, context, mutation) {


                if (isErrorResponse(error)) {
                    console.log('isErrorResponse')
                    error.errors.forEach(err => {
                        if (!err.toast) return;
                        toast(err.message, {
                            type: 'error'
                        });
                    });
                }

                if (isTRPCError(error)) {
                    console.log('isTRPCError')
                    console.log(JSON.stringify(error, null, 5),'error')
                    if (error.data?.zodError?.fieldErrors) {
                        Object.entries(error.data?.zodError?.fieldErrors ?? {}).forEach(([key, value]) => {
                            toast(key + ':' + (value?.[0] ?? 'Unknown error'), {
                                type: 'error'

                            });
                        });
                    }
                    console.log(JSON.stringify(error.data, null, 5),'error.data')
                    if (error.data?.causeData?.toast) {
                        toast(error.data.causeData.message, {
                            type: 'error'
                        });
                    }

                    console.log(JSON.stringify(error.data?.causeData, null, 5),'error.data.causeData')
                    
                }

                console.log('not')



            },
            onSuccess(data, variables, context, mutation) {
                console.log('onSuccess', data, variables, context, mutation);
                console.log(mutation.options,'options')
                if (mutation.options.mutationKey?.some(k => k === MUTATION_KEYS.LOGOUT)) {
                    console.log('1')
                    // @ts-ignore
                    this.queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ME] });
                }
                if (mutation.options.meta?.invalidates) {
                    console.log('2')
                    mutation.options.meta.invalidates.forEach(key => {
                        // @ts-ignore
                        this.queryClient.invalidateQueries({ queryKey: [key] });
                    });
                }
                if (mutation.options.meta?.invalidateAndAwait) {
                    console.log('3')
                    const _promisesToAwait = mutation.options.meta.invalidateAndAwait.map(key => {
                        // @ts-ignore
                        return this.queryClient.invalidateQueries({ queryKey: [key] });
                    });
                    return Promise.all(_promisesToAwait);
                }
            },
        })
    });
}
