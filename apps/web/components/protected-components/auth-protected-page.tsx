import { redirect } from "next/navigation"
import { getSessionOnServerComponent } from "."

export const AuthProtectedPage = async ({ 
    // redirectPath,
    children,
}: {
    children: React.ReactNode,
    // roles:TRole[]
    // redirectPath:string

})=> { 

    const session = await getSessionOnServerComponent()

    const isAuthenticated = session&&session.success

    if(!isAuthenticated) redirect('/auth/login')

    return children
}