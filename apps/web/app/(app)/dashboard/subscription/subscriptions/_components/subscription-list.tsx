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
import SubscriptionCrudModal from "./subscription-crud-modal"
import { CustomPagination } from "@/components/dashboard/custom-pagination"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Database } from "lucide-react"
import { GlobalModalManager } from "@/components/global/modal/global-confirm-moda"
import { SahredEnums } from "@repo/shared/enums"

export const SubscriptionList = () => {
    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [selectedSubscription, setSelectedSubscription] = useState<TSchemaSubscription.TSubscriptionRepository.TSubscriptionWithRelationSelect | undefined>(undefined)

    const [query, setQuery] = useState<TSubscriptionValidator.TSubscriptionPaginationQuery>({
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
    } = useQuery(trpc.subscription.getSubscriptionsWithPagination.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    const handleEdit = (subscription: TSchemaSubscription.TSubscriptionRepository.TSubscriptionWithRelationSelect) => {
        setSelectedSubscription(subscription)
        setIsOpen(true)
    }

    const handleDelete = (subscription: TSchemaSubscription.TSubscriptionRepository.TSubscriptionWithRelationSelect) => {
        GlobalModalManager.show({
            type: 'danger',
            text1: 'Delete Subscription',
            text2: `Are you sure you want to delete this subscription for "${subscription.user?.email || 'unknown'}"? This action cannot be undone.`,
            onClickPrimaryButton: async () => {
                await trpc.subscription.deleteSubscription.mutate({ id: subscription.id })
            }
        })
    }

    const handleCreate = () => {
        setSelectedSubscription(undefined)
        setIsOpen(true)
    }

    return (
        <div className="">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
                        <p className="text-sm text-muted-foreground">Manage user subscriptions</p>
                    </div>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Subscription
                </Button>
            </div>

            {isOpen && (
                <SubscriptionCrudModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    initial={selectedSubscription}
                />
            )}

            <div className="rounded-lg border bg-card min-h-[400px]">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Period Start</TableHead>
                            <TableHead>Period End</TableHead>
                            <TableHead>Cancel at Period End</TableHead>
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
                                    No subscriptions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((subscription) => (
                                <TableRow key={subscription.id}>
                                    <TableCell className="font-medium">{subscription.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{subscription.user?.email || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{subscription.plan?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={subscription.statusId === SahredEnums.SubscriptionStatus.active ? 'default' : 'secondary'}>
                                            {subscription.status.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(subscription.currentPeriodStart).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={subscription.cancelAtPeriodEnd ? 'destructive' : 'outline'}>
                                            {subscription.cancelAtPeriodEnd ? 'Yes' : 'No'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(subscription)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(subscription)}
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
