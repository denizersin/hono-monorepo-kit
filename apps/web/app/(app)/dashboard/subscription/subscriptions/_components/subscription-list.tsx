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
import SubscriptionCrudModal from "./subscription-crud-modal"
import { CustomPagination } from "@/components/dashboard/custom-pagination"

export const SubscriptionList = () => {

    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")

    const [initial, setInitial] = useState<TSchemaSubscription.TSubscriptionRepository.TSubscriptionWithRelationSelect | undefined>(undefined)

    const [query, setQuery] = useState<TSubscriptionValidator.TSubscriptionPaginationQuery>({
        pagination: {
            page: 1,
            limit: 10,
        },
        sort: [{
            sortBy: 'desc',
            sortField: 'createdAt'
        }],
        filter: {
        },
    })


    const {
        data: paginationData,
        isLoading
    } = useQuery(trpc.subscription.getSubscriptionsWithPagination.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    return <div>
        <h1>Subscription List</h1>

        <Button onClick={() => {
            setIsOpen(true)
            setInitial(undefined)
        }}>Create Subscription</Button>
        {isOpen && <SubscriptionCrudModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            initial={initial}
        />}
        <div className="rounded-lg border bg-card min-h-[400px]">


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Period Start</TableHead>
                        <TableHead>Period End</TableHead>
                        <TableHead>Cancel at Period End</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.user?.email || 'N/A'}</TableCell>
                            <TableCell>{item.plan?.name || 'N/A'}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{new Date(item.currentPeriodStart).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(item.currentPeriodEnd).toLocaleDateString()}</TableCell>
                            <TableCell>{item.cancelAtPeriodEnd ? 'Yes' : 'No'}</TableCell>
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
