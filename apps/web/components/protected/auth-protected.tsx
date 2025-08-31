"use client";

import { TRole } from "@repo/shared/types";
import { useSession } from "@/hooks/common";
import { redirect } from "next/navigation";
import { useMemo } from "react";
import { toast } from "react-toastify";


type AuthProtectedProps = {
    children: React.ReactNode;
    redirectPath?: string;
    roles?: TRole[];
}

export const AuthProtected = ({ children, redirectPath, roles }: AuthProtectedProps) => {
    const { isAuthenticated, isLoading, session } = useSession();

    const isAllowed = useMemo(() => {
        if (!isAuthenticated) return false
        if (roles) {
            return roles.some((role) => session?.role === role);
        }
        return true
    }, [isAuthenticated, roles, session]);


    if (isLoading) return null

    if (!isAllowed && redirectPath) {
        return redirect(redirectPath)
    }


    if (!isAllowed) {
        toast.error('You are not authorized to access this page')
        return redirect('/')
    }


    return <div>{children}</div>;
};