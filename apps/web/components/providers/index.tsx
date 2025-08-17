"use client"

import { TSession } from "@repo/shared/types";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "./auth-provider";
import { ReactQueryProvider } from "./react-query-provider";
import { TRPCReactProvider } from "./trpc/trpc-provider";
export const Providers = ({ children, session

}: {
    children: React.ReactNode
    session?: TSession

}) => {
    return <React.Fragment>
        <ToastContainer />
        <TRPCReactProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </TRPCReactProvider>
    </React.Fragment>

}