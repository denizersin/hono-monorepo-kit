import { TCharacterValidator } from "@repo/shared/validators"
import { useState } from "react"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { CustomPagination } from "@/components/dashboard/custom-pagination"

export const PersonaList = () => {

    const trpc = useTRPC()



    const [query, setQuery] = useState<TCharacterValidator.TPersonaPaginationQuery>({
        pagination: {
            page: 1,
            limit: 10,
        },
        sort: [],
        filter: {
            name: '',
        },
    })


    const {
        data: paginationData,
        isLoading
    } = useQuery(trpc.character.getAllPersonasWithTranslations.queryOptions(query))

    const data = paginationData?.data

    return <div>
        <h1>Persona List</h1>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        {/* <CustomPagination
            paginationData={data}
            pagination={query}
            setPagination={setQuery}
        /> */}
    </div>


}   