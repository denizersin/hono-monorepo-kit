import { redirect } from "next/navigation"
import { getSessionOnServerComponent } from "."
import { TRole } from "@repo/shared/types"
export const RoleProtectedPage = async ({ 
    redirectPath,
    roles,
}: {
    children: React.ReactNode,
    roles:TRole[]
    redirectPath:string
}) => { 

    const session = await getSessionOnServerComponent()

    const isAuthenticated = session&&session.success

    if(!isAuthenticated) redirect('/auth/login')

    if(roles.includes(session.data.user.role)) redirect(redirectPath)
}