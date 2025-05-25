
export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    // return <ProtectedPage roles={[SahredEnums.Role.ADMIN]} redirectPath="/">
    //     {children}
    // </ProtectedPage>
    return <>{children}</>
}