import { TCharacterValidator } from "@repo/shared/validators"
import { useState } from "react"

import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { TSchemaCharacter } from "@repo/shared/schema"
import { useQuery } from "@tanstack/react-query"
import PersonaCrudModal from "./persona-crud-modal"
import { CustomPagination } from "@/components/dashboard/custom-pagination"

export const PersonaList = () => {

    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")

    const [initial, setInitial] = useState<TSchemaCharacter.TCharacterRepositoryTypes.TPersonaWithTranslations | undefined>(undefined)

    const [query, setQuery] = useState<TCharacterValidator.TPersonaPaginationQuery>({
        pagination: {
            page: 1,
            limit: 5,
        },
        sort: [{
            sortBy: 'asc',
            sortField: 'createdAt'
        }],
        filter: {
        },
    })


    const {
        data: paginationData,
        isLoading
    } = useQuery(trpc.character.getAllPersonasWithTranslations.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    return <div>
        <h1>Persona List</h1>

        <Button onClick={() => {
            setIsOpen(true)
            setInitial(undefined)
        }}>Create Persona</Button>
        {isOpen && <PersonaCrudModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            initial={initial}
        />}
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
                        <TableCell>
                            <Button onClick={() => {
                                setIsOpen(true)
                                setMode("edit")
                                setInitial(item)
                            }}>Edit</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        {pagination && <CustomPagination
            paginationData={pagination}
            pagination={query}
            setPagination={(p) => setQuery({ ...query, pagination: p.pagination })}
        />}
    </div>


}   