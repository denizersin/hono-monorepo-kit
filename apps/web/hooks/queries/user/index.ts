import { queryOptions, useQuery } from "@tanstack/react-query"
import { baseQueryOptions, QUERY_KEYS } from ".."
import { clientWithType } from "@web/lib/api-client"


export const userQueryOptions = queryOptions({
    queryKey: [clientWithType.user.me.$url().pathname],
    queryFn: async () => {
        const response = await clientWithType.user.me.$get()
        if (response.ok) {
            return response.json()
        } else {
            const res = await response.json()
            if (!res.success) {
                res
                //type=>  {
                // success: false;
                // errors: {
                //     message: string;
                //     code: string;
                //     details ?: any;
                //     errorCode: TErrorCode;
                // } [];
            }
        }
    }
})

export const useUserMeQuery = () => {
    const { data, error } = useQuery(userQueryOptions)
    //error type=> : Error:null
    return data
}