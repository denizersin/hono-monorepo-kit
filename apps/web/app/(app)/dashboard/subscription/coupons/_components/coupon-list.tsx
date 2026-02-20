"use client"

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
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Ticket } from "lucide-react"
import { GlobalModalManager } from "@/components/global/modal/global-confirm-moda"

export const CouponList = () => {
    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState<TSchemaSubscription.TSubscriptionRepository.TCouponWithRelationSelect | undefined>(undefined)

    const [query, setQuery] = useState<TSubscriptionValidator.TCouponPaginationQuery>({
        pagination: {
            page: 1,
            limit: 10,
        },
        sort: [{
            sortBy: 'desc',
            sortField: 'createdAt'
        }],
        filter: {},
    })

    const {
        data: paginationData,
        isLoading
    } = useQuery(trpc.subscription.getCouponsWithPagination.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    const handleEdit = (coupon: TSchemaSubscription.TSubscriptionRepository.TCouponWithRelationSelect) => {
        setSelectedCoupon(coupon)
        setIsOpen(true)
    }

    const handleDelete = (coupon: TSchemaSubscription.TSubscriptionRepository.TCouponWithRelationSelect) => {
        GlobalModalManager.show({
            type: 'danger',
            text1: 'Delete Coupon',
            text2: `Are you sure you want to delete coupon "${coupon.code}"? This action cannot be undone.`,
            onClickPrimaryButton: async () => {
                await trpc.subscription.deleteCoupon.mutate({ id: coupon.id })
            }
        })
    }

    const handleCreate = () => {
        setSelectedCoupon(undefined)
        setIsOpen(true)
    }

    return (
        <div className="">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>
                        <p className="text-sm text-muted-foreground">Manage discount coupons</p>
                    </div>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Coupon
                </Button>
            </div>

            {isOpen && (
                <CouponCrudModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    initial={selectedCoupon}
                />
            )}

            <div className="rounded-lg border bg-card min-h-[400px]">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Discount Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Duration in Months</TableHead>
                            <TableHead>Store Offer ID</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                    No coupons found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell className="font-medium">{coupon.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{coupon.code}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{coupon.discount_type}</TableCell>
                                    <TableCell className="text-muted-foreground">{coupon.value}</TableCell>
                                    <TableCell className="text-muted-foreground">{coupon.duration}</TableCell>
                                    <TableCell className="text-muted-foreground">{coupon.duration_in_months || '-'}</TableCell>
                                    <TableCell className="text-muted-foreground">{coupon.store_offer_id || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(coupon)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(coupon)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="mt-4">
                    <CustomPagination
                        paginationData={pagination}
                        pagination={query}
                        setPagination={(p) => setQuery({ ...query, pagination: p.pagination })}
                    />
                </div>
            )}
        </div>
    )
}
