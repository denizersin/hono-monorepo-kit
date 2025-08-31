"use client"

import { TSession } from "@repo/shared/types";
import React from "react";
import { ToastContainer } from 'react-toastify';
import { GlobalLoadingModal } from "../global/modal/global-lodaing-modal";
import { AuthProvider } from "./auth-provider";
import { TRPCReactProvider } from "./trpc/trpc-provider";
import { GlobalModal } from "../global/modal/global-confirm-moda";
export const Providers = ({ children, session

}: {
    children: React.ReactNode
    session?: TSession

}) => {
    return <React.Fragment>
        <GlobalLoadingModal />
        <GlobalModal />
        <ToastContainer />
        <TRPCReactProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </TRPCReactProvider>
    </React.Fragment>

}