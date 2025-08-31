"use client"
import { SahredEnums } from '@repo/shared/enums'
import type React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/common'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {

    const { isAuthenticated, isLoading, session } = useSession()

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