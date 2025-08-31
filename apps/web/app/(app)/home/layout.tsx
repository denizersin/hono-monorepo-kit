import { SahredEnums } from "@repo/shared/enums"
import { AuthProtected } from "@/components/protected/auth-protected"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AuthProtected>
        {children}
    </AuthProtected>
}