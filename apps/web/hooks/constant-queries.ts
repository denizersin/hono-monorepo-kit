import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { SahredEnums } from "@repo/shared/enums"

export const useGetCountries = () => {
    const trpc = useTRPC()
    return useQuery(trpc.constants.getCountries.queryOptions())
}

export const useSelectDataForCountries = () => {
    const query = useGetCountries()
    const data = query.data?.map((country) => ({
        label: country.phoneCode + " - " + country.name,
        value: country.id.toString()
    })) || []
    return { selectData: data, isLoading: query.isLoading, isError: query.isError }
}

export const useGetLanguages = () => {
    const trpc = useTRPC()
    return useQuery(trpc.constants.getLanguages.queryOptions())
}

export const useGetCompanyLanguages = () => {
    const trpc = useTRPC()
    return useQuery(trpc.constants.getCompanyLanguages.queryOptions())
}
export const useSelectDataForCompanyLanguages = () => {
    const query = useGetCompanyLanguages()
    const data = query.data?.map((language) => ({
        label: language.name,
        value: language.id.toString()
    })) || []
    return { selectData: data, isLoading: query.isLoading, isError: query.isError }
}

export const useSelectDataForLanguages = () => {
    const query = useGetLanguages()
    const data = query.data?.map((language) => ({
        label: language.name,
        value: language.id.toString()
    })) || []
    return { selectData: data, isLoading: query.isLoading, isError: query.isError }
}

export const useGetAllPlans = () => {
    const trpc = useTRPC()
    return useQuery(trpc.subscription.getAllPlansForSelect.queryOptions())
}

export const getCurrenciesSelectData = () => {
    return Object.values(SahredEnums.Currency).map((currency) => ({
        label: currency,
        value: currency
    }))
}

export const getPlanIntervalsSelectData = () => {
    return Object.values(SahredEnums.Plan_Interval).map((interval) => ({
        label: interval,
        value: interval
    }))
}
export const getSubscriptionStatusSelectData = () => {
    return Object.entries(SahredEnums.SubscriptionStatus).map(([key, value]) => ({
        label: key,
        value: value.toString()
    }))
}