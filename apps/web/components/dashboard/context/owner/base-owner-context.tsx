"use client"
import { LoadingManager, useMultipleLoadingModal, useSingleLoadingModal } from "@/components/global/modal/global-lodaing-modal"
import { useGetCompanyLanguages, useGetCountries, useGetLanguages } from "@/hooks/constant-queries"
import { RouterOutputs } from "@server/trpc/routers"
import { createContext, useEffect } from "react"

type OwnerContextType = {
    countriesData: RouterOutputs['constants']['getCountries'],
    allLanguagesData: RouterOutputs['constants']['getLanguages'],
    companyLanguagesData: RouterOutputs['constants']['getCompanyLanguages'],
}




export const OwnerContext = createContext<OwnerContextType>({
    countriesData: [],
    allLanguagesData: [],
    companyLanguagesData: [],
})


export const OwnerContextProvider = ({ children }: { children: React.ReactNode }) => {

    const { data: countriesData,  promise: countriesPromise } = useGetCountries()
    const { data: allLanguagesData, promise: allLanguagesPromise } = useGetLanguages()
    const { data: companyLanguagesData, promise: companyLanguagesPromise } = useGetCompanyLanguages()



    // useSingleLoadingModal(Promise.all([countriesPromise!, allLanguagesPromise!, companyLanguagesPromise!]))


    useSingleLoadingModal(countriesPromise!)
    useSingleLoadingModal(allLanguagesPromise!)
    
    useSingleLoadingModal(companyLanguagesPromise!)


    useEffect(()=>{
        console.log('countriesPromise Effect', countriesPromise)
    },[countriesPromise])

    if (!countriesData || !allLanguagesData || !companyLanguagesData) {
        return null
    }

    


    return (
        <OwnerContext.Provider value={{ countriesData, allLanguagesData, companyLanguagesData }}>
            {children}
        </OwnerContext.Provider>
    )
}