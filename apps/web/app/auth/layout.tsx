"use client"
import { SahredEnums } from '@repo/shared/enums'
import { useSession } from '@web/hooks/queries/auth'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {

    const {
        isAuthenticated,
        isLoading,
        isError,
        session
    } = useSession()
    const router = useRouter()
    const pathname = usePathname()

    const role = session?.role
    useEffect(() => {
        const isAuthRoute = pathname?.includes('/auth')
        if (isLoading) return;

        if (!isAuthenticated && !isAuthRoute) {
            router.push('/auth/login')
        }

        if (role === SahredEnums.Role.ADMIN) {
            router.push('/admin')
        }
        else if (role === SahredEnums.Role.OWNER) {
            router.push('/owner')
        }
        else if (role === SahredEnums.Role.USER) {
            router.push('/home')
        }


    }, [isAuthenticated, isLoading, isError])

    return children
}


export default Layout