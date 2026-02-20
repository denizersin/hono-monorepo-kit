import { TSubscriptionValidator } from "@repo/shared/validators"
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
import { TSchemaSubscription } from "@repo/shared/schema"
import { useQuery } from "@tanstack/react-query"
import PlanCrudModal from "./plan-crud-modal"
import { CustomPagination } from "@/components/dashboard/custom-pagination"

export const PlanList = () => {

    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")

    const [initial, setInitial] = useState<TSchemaSubscription.TSubscriptionRepository.TPlanWithRelationSelect | undefined>(undefined)

    const [query, setQuery] = useState<TSubscriptionValidator.TPlanPaginationQuery>({
        pagination: {
            page: 1,
            limit: 10,
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
    } = useQuery(trpc.subscription.getPlansWithPagination.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    return <div>
        <h1>Plan List</h1>

        <Button onClick={() => {
            setIsOpen(true)
            setInitial(undefined)
        }}>Create Plan</Button>
        {isOpen && <PlanCrudModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            initial={initial}
        />}
        <div className="rounded-lg border bg-card min-h-[400px]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Interval</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.currency}</TableCell>
                            <TableCell>{item.interval}</TableCell>
                            <TableCell>{item.active ? 'Yes' : 'No'}</TableCell>
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
        </div>

        {pagination && <CustomPagination
            className="mt-4"
            paginationData={pagination}
            pagination={query}
            setPagination={(p) => setQuery({ ...query, pagination: p.pagination })}
        />}
    </div>


}
