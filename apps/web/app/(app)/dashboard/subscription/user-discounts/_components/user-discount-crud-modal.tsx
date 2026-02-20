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
import { TSchemaSubscription } from "@repo/shared/schema"
import { subscriptionValidator } from "@repo/shared/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

type UserDiscountCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initial?: TSchemaSubscription.TSubscriptionRepository.TUserDiscountWithRelationSelect
}

const formSchema = subscriptionValidator.createUserDiscountSchema

type FormValues = z.infer<typeof formSchema>

export function UserDiscountCrudModal({ isOpen, setIsOpen, initial }: UserDiscountCrudModalProps) {
    const trpc = useTRPC()

    const queryClient = useQueryClient()

    function onSuccsesCrud() {
        setIsOpen(false)
        queryClient.invalidateQueries(trpc.subscription.getAllUserDiscounts.queryFilter())
    }

    const createUserDiscount = useMutation(trpc.subscription.createUserDiscount.mutationOptions({
        onSuccess: () => {
            onSuccsesCrud()
        }
    }))

    const updateUserDiscount = useMutation(trpc.subscription.updateUserDiscount.mutationOptions({
        onSuccess: () => {
            onSuccsesCrud()
        }
    }))

    const isCreate = useMemo(() => {
        return !initial
    }, [initial])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = (data: FormValues) => {
        if (isCreate) {
            // For create, user_id would need to be passed or come from context
            // This is a placeholder, adjust as needed
            console.log('Create user discount', data)
        } else {
            updateUserDiscount.mutate({
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
            const { user, coupon, ...discountData } = initial
            form.reset({
                discountData: discountData
            })
        } else {
            form.reset()
        }
    }, [isOpen, initial])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isCreate ? "Create User Discount" : "Edit User Discount"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="discountData.coupon_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coupon ID</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="discountData.is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active</FormLabel>
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
                            <Button type="submit" disabled={form.formState.isSubmitting || isCreate}>
                                {form.formState.isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UserDiscountCrudModal
