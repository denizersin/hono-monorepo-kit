import { useSession } from "@/hooks/common"
import { useSingleLoadingModal } from "../global/modal/global-lodaing-modal"



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { query, session } = useSession()
    useSingleLoadingModal(query.promise)


    return children
}