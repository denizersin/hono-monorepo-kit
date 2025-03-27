import { TSession } from "@repo/shared/types"
import { useAuthQuery } from "@web/hooks/queries/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



type TAuthContext = {
    session: TSession | null,

}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const sessionQuery = useAuthQuery()


    const router = useRouter()
    console.log('sessionQuery')
    console.log(sessionQuery.data, sessionQuery.isError)

    useEffect(() => {
        if (sessionQuery.isPending || sessionQuery.isLoading) return;
        if (!sessionQuery.data || sessionQuery.isError) {
            router.push('/auth/login')
        }
    }, [sessionQuery.data, sessionQuery.isPending, sessionQuery.isLoading, sessionQuery.isError])


    return <>{children}</>
}