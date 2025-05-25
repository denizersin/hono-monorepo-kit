import { Providers } from "@web/components/providers"

export default async function ServerRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <Providers >
        {children}
    </Providers>
}