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
import CampaignCrudModal from "./campaign-crud-modal"
import { CustomPagination } from "@/components/dashboard/custom-pagination"

export const CampaignList = () => {

    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")

    const [initial, setInitial] = useState<TSchemaSubscription.TSubscriptionRepository.TCampaignWithRelationSelect | undefined>(undefined)

    const [query, setQuery] = useState<TSubscriptionValidator.TCampaignPaginationQuery>({
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
    } = useQuery(trpc.subscription.getCampaignsWithPagination.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    return <div>
        <h1>Campaign List</h1>

        <Button onClick={() => {
            setIsOpen(true)
            setInitial(undefined)
        }}>Create Campaign</Button>
        {isOpen && <CampaignCrudModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            initial={initial}
        />}
        <div className="rounded-lg border bg-card min-h-[400px]">


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Discount Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Target Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.discount_type}</TableCell>
                            <TableCell>{item.value}</TableCell>
                            <TableCell>{item.target_type}</TableCell>
                            <TableCell>{new Date(item.start_date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(item.end_date).toLocaleDateString()}</TableCell>
                            <TableCell>{item.is_active ? 'Yes' : 'No'}</TableCell>
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
