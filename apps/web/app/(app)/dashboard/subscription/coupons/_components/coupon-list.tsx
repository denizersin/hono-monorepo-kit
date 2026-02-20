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
import CouponCrudModal from "./coupon-crud-modal"
import { CustomPagination } from "@/components/dashboard/custom-pagination"

export const CouponList = () => {

    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")

    const [initial, setInitial] = useState<TSchemaSubscription.TSubscriptionRepository.TCouponWithRelationSelect | undefined>(undefined)

    const [query, setQuery] = useState<TSubscriptionValidator.TCouponPaginationQuery>({
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
    } = useQuery(trpc.subscription.getCouponsWithPagination.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    return <div>
        <h1>Coupon List</h1>

        <Button onClick={() => {
            setIsOpen(true)
            setInitial(undefined)
        }}>Create Coupon</Button>
        {isOpen && <CouponCrudModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            initial={initial}
        />}
        <div className="rounded-lg border bg-card min-h-[400px]">


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Duration in Months</TableHead>
                        <TableHead>Store Offer ID</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.discount_type}</TableCell>
                            <TableCell>{item.value}</TableCell>
                            <TableCell>{item.duration}</TableCell>
                            <TableCell>{item.duration_in_months || '-'}</TableCell>
                            <TableCell>{item.store_offer_id || '-'}</TableCell>
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
