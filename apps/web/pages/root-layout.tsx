import { Providers } from "@/components/providers"

export default async function ServerRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <Providers >
        {children}
    </Providers>
}