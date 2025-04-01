import { AuthProtectedPage } from "@web/components/protected-components/auth-protected-page"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AuthProtectedPage>
        {children}
    </AuthProtectedPage>
}