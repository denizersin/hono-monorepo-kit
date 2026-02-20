"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useGetAllPlans } from "@/hooks/constant-queries"
import { TSchemaSubscription } from "@repo/shared/schema"
import { subscriptionValidator, TSubscriptionValidator } from "@repo/shared/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

type SubscriptionCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initial?: TSchemaSubscription.TSubscriptionRepository.TSubscriptionWithRelationSelect
}

const formSchema = subscriptionValidator.createSubscriptionSchema


export function SubscriptionCrudModal({ isOpen, setIsOpen, initial }: SubscriptionCrudModalProps) {
    const trpc = useTRPC()

    const queryClient = useQueryClient()

    function onSuccsesCrud() {
        setIsOpen(false)
        queryClient.invalidateQueries(trpc.subscription.getSubscriptionsWithPagination.queryFilter())
    }

    const { data: plans, isLoading: plansLoading } = useGetAllPlans()

    const createSubscription = useMutation(trpc.subscription.createSubscription.mutationOptions({
        onSuccess: () => {
            onSuccsesCrud()
        }
    }))

    const updateSubscription = useMutation(trpc.subscription.updateSubscription.mutationOptions({
        onSuccess: () => {
            onSuccsesCrud()
        }
    }))

    const isCreate = useMemo(() => {
        return !initial
    }, [initial])

    const form = useForm<TSubscriptionValidator.TCreateSubscription>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = (data: TSubscriptionValidator.TCreateSubscription) => {
        if (isCreate) {
            createSubscription.mutate(data)
        } else {
            updateSubscription.mutate({
                id: initial!.id,
                data: data
            })
        }
    }

    useEffect(() => {
        if (!isOpen) {
            return form.reset()
        }

        if (initial) {
            const { user, plan, events, ...subscriptionData } = initial


            form.reset({
                subscriptionData
            })
        } else {
            form.reset()
        }
    }, [isOpen, initial])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isCreate ? "Create Subscription" : "Edit Subscription"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="subscriptionData.userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User ID</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subscriptionData.planId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                                        >
                                            <option value="">Select a plan</option>
                                            {plans?.map((plan) => (
                                                <option key={plan.id} value={plan.id}>
                                                    {plan.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subscriptionData.status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Input placeholder="active" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subscriptionData.currentPeriodStart"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Period Start</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            {...field}
                                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subscriptionData.currentPeriodEnd"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Period End</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            {...field}
                                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subscriptionData.cancelAtPeriodEnd"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Cancel at Period End</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default SubscriptionCrudModal
