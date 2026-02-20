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
import UserDiscountCrudModal from "./user-discount-crud-modal"

export const UserDiscountList = () => {

    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")

    const [initial, setInitial] = useState<TSchemaSubscription.TSubscriptionRepository.TUserDiscountWithRelationSelect | undefined>(undefined)


    const {
        data: discounts,
        isLoading
    } = useQuery(trpc.subscription.getAllUserDiscounts.queryOptions())

    return <div>
        <h1>User Discount List</h1>

        <Button onClick={() => {
            setIsOpen(true)
            setInitial(undefined)
        }}>Create User Discount</Button>
        {isOpen && <UserDiscountCrudModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            initial={initial}
        />}
        <div className="rounded-lg border bg-card min-h-[400px]">


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Coupon Code</TableHead>
                        <TableHead>Applied At</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {discounts?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.user?.email || 'N/A'}</TableCell>
                            <TableCell>{item.coupon?.code || 'N/A'}</TableCell>
                            <TableCell>{new Date(item.applied_at).toLocaleDateString()}</TableCell>
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
    </div>


}
