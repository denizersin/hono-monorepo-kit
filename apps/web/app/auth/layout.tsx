"use client"
import {  useSession } from '@web/hooks/queries/auth'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {

    const {
        isAuthenticated,
        isLoading,
        isError
    } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated) {
            router.push('/')
        }

        if (isError || !isAuthenticated) {
            router.push('/auth/login')
        }
    }, [isAuthenticated, isLoading, isError])

    return children
}


export default Layout