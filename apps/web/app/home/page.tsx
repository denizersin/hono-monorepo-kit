"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@web/hooks/queries"
import { authQueryOptions, useSession } from "@web/hooks/queries/auth"

export default function Home() {
    const { data, isLoading,isFetching,error } = useQuery({
        ...authQueryOptions,
    })
    console.log('render', isLoading)
    const queryClient = useQueryClient()
    return <div>
        <button onClick={() => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SESSION] })
        }}>Invalidate Session2</button>
        <h1>Home</h1>
        <p>Session: {JSON.stringify(data)}</p>
    </div>
}