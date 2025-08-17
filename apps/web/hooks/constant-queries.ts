import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@web/components/providers/trpc/trpc-provider"

export const useGetCountries = () => {
    const trpc = useTRPC()
    return useQuery(trpc.constants.getCountries.queryOptions())
}

export const useSelectDataForCountries = () => {
    const query = useGetCountries()
    const data = query.data?.map((country) => ({
        label: country.name,
        value: country.id.toString()
    })) || []
    return { selectData: data, isLoading: query.isLoading, isError: query.isError }
}

export const useGetLanguages = () => {
    const trpc = useTRPC()
    return useQuery(trpc.constants.getLanguages.queryOptions())
}

export const useSelectDataForLanguages = () => {
    const query = useGetLanguages()
    const data = query.data?.map((language) => ({
        label: language.name,
        value: language.id.toString()
    })) || []
    return { selectData: data, isLoading: query.isLoading, isError: query.isError }
}