"use client"
import { SahredEnums } from '@repo/shared/enums'
import { useSession } from '@web/hooks/queries/auth'
import type React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {

    const { isAuthenticated, isLoading, isError, session } = useSession()

    const router = useRouter()



    useEffect(() => {
        if (!isAuthenticated || isLoading) return;

        if (session?.role === SahredEnums.Role.ADMIN) {
            router.push('/admin')
        }
        else if (session?.role === SahredEnums.Role.OWNER) {
            router.push('/owner')
        }
        else if (session?.role === SahredEnums.Role.USER) {
            router.push('/home')
        }
    }, [isAuthenticated, session])


    return children
}


export default Layout