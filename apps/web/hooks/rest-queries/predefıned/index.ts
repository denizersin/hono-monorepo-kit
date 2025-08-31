import { useQuery } from "@tanstack/react-query"
import { clientWithType } from "@/lib/api-client"
import { QUERY_KEYS } from ".."

export const useGetCountries = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.COUNTRIES],
        queryFn: async () => {
            const response = await clientWithType.constants.countries.$get()
            const data = await response.json()
            return data
        },
        select: (data) => data.data,
        staleTime:Infinity
    })
}

export const useCountriesSelectData = () => {
    const query = useGetCountries()
    const data = query.data?.map((country) => ({
        label: country.name,
        value: country.id.toString()
    })) || []

    return { selectData: data, isLoading: query.isLoading, isError: query.isError }


}