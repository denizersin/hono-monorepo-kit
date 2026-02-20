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
import { useMutation, useQuery } from "@tanstack/react-query"
import PlanCrudModal from "./plan-crud-modal"
import { CustomPagination } from "@/components/dashboard/custom-pagination"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, CreditCard } from "lucide-react"
import { GlobalModalManager } from "@/components/global/modal/global-confirm-moda"
import { useQueryClient } from "@tanstack/react-query"

export const PlanList = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<TSchemaSubscription.TSubscriptionRepository.TPlanWithRelationSelect | undefined>(undefined)

    const [query, setQuery] = useState<TSubscriptionValidator.TPlanPaginationQuery>({
        pagination: {
            page: 1,
            limit: 10,
        },
        sort: [{
            sortBy: 'asc',
            sortField: 'createdAt'
        }],
        filter: {},
    })

    const {
        data: paginationData,
        isLoading
    } = useQuery(trpc.subscription.getPlansWithPagination.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    const { mutateAsync: deletePlan } = useMutation(trpc.subscription.deletePlan.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: trpc.subscription.getPlansWithPagination.queryKey()
            })
        }
    }))


    const handleEdit = (plan: TSchemaSubscription.TSubscriptionRepository.TPlanWithRelationSelect) => {
        setSelectedPlan(plan)
        setIsOpen(true)
    }

    const handleDelete = (plan: TSchemaSubscription.TSubscriptionRepository.TPlanWithRelationSelect) => {
        GlobalModalManager.show({
            type: 'danger',
            text1: 'Delete Plan',
            text2: `Are you sure you want to delete "${plan.name}"? This action cannot be undone.`,
            onClickPrimaryButton: async () => {
                await deletePlan({ id: plan.id })
            }
        })
    }

    const handleCreate = () => {
        setSelectedPlan(undefined)
        setIsOpen(true)
    }

    return (
        <div className="">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Plans</h1>
                        <p className="text-sm text-muted-foreground">Manage subscription plans</p>
                    </div>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Plan
                </Button>
            </div>

            {isOpen && (
                <PlanCrudModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    initial={selectedPlan}
                />
            )}

            <div className="rounded-lg border bg-card min-h-[400px]">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead>Interval</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No plans found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{plan.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{plan.price}</TableCell>
                                    <TableCell className="text-muted-foreground">{plan.currency}</TableCell>
                                    <TableCell className="text-muted-foreground">{plan.interval}</TableCell>
                                    <TableCell>
                                        <Badge variant={plan.active ? 'default' : 'secondary'}>
                                            {plan.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(plan)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(plan)}
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
