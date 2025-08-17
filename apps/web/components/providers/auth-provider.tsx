import { TSession } from "@repo/shared/types"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "./trpc/trpc-provider"



type TAuthContext = {
    session: TSession | null,

}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const trpc = useTRPC()
    const { data, isLoading, isError,error } = useQuery(trpc.auth.getSession.queryOptions())

    console.log(data, 'data')


    // useEffect(() => {
    //     if (isLoading||isAuthRoute) return;
    //     if (!isAuthenticated) {
    //         router.push('/auth/login')
    //     }
    // }, [isAuthenticated, isLoading, isError])


    return <>{children}</>
}