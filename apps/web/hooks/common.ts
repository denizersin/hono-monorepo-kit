import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@web/components/providers/trpc/trpc-provider"

export const useSession = () => {


    const trpc = useTRPC()

    const query = useQuery(trpc.auth.getSession.queryOptions())




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