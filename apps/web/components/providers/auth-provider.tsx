import { TSession } from "@repo/shared/types"
import {  useSession } from "@web/hooks/queries/auth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"



type TAuthContext = {
    session: TSession | null,

}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const pathname = usePathname()
    const isAuthRoute = pathname.includes('/auth')

    const { isAuthenticated, isLoading, isError } = useSession()

    const router = useRouter()

    useEffect(() => {
        if (isLoading||isAuthRoute) return;
        if (!isAuthenticated) {
            router.push('/auth/login')
        }
    }, [isAuthenticated, isLoading, isError])


    return <>{children}</>
}