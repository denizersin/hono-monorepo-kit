import { queryOptions, useQuery } from "@tanstack/react-query"

import { clientWithType, } from "@web/lib/api-client"


export const userQueryOptions = queryOptions({
    queryKey: [clientWithType.user.me.$url().pathname],
    queryFn: async () => {
        const response = await clientWithType.user.me.$get();
        const data = await response.json()
        if (!response.ok) throw data
        return data
    },
    select: (data) => data.data
})





async function getUserMe() {
    const response = await (clientWithType.user.me.$get())
    return response.json()
}

export const useUserMeQuery = () => {
    const query = useQuery({
        ...userQueryOptions,

    })
    const { data, isLoading, error } = query

    return query
}
