import { useQuery } from "@tanstack/react-query"
import { clientWithType } from "@web/lib/api-client"

export const useGetCountries = () => {
    return useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            const response = await clientWithType.constants.countries.$get()
            const data = await response.json()
            return data
        },
        select: (data) => data.data
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