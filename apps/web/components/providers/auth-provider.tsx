import { useSession } from "@/hooks/common"
import { useSingleLoadingModal } from "../global/modal/global-lodaing-modal"
import { useEffect } from "react"
import { GlobalModalManager } from "../global/modal/global-confirm-moda"



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { query } = useSession()
    useSingleLoadingModal(query.promise)

    useEffect(() => {
        // GlobalModalManager.show({
        //     type: 'info',

        // })
    }, [])

    return children
}