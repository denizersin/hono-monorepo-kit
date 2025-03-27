"use client"

import React from "react"
import { AuthProvider } from "./auth-provider"
import { ReactQueryProvider } from "./react-query-provider"
import { ToastContainer } from 'react-toastify';
export const Providers = ({ children }: { children: React.ReactNode }) => {
    return <React.Fragment>
        <ToastContainer />
        <ReactQueryProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ReactQueryProvider>
    </React.Fragment>

}