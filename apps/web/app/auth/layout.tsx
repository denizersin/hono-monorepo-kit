"use client"
import { useAuthQuery } from '@web/hooks/queries/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {

    const sessionQuery = useAuthQuery()
    const router = useRouter()
    useEffect(() => {
        if (sessionQuery.data && !sessionQuery.isPending) {
            router.push('/')
        }
    }, [sessionQuery.data, sessionQuery.isPending])

    return children
}


export default Layout