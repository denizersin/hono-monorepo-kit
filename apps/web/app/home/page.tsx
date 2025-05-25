"use client"

import { useSession } from "@web/hooks/queries/auth"

export default function Home() {
    const { session} = useSession()
    return <div>
        <h1>Home</h1>
        <p>Session: {JSON.stringify(session)}</p>
    </div>
}