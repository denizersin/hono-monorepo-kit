"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SahredEnums } from "@repo/shared/enums"
import { TSchemaSubscription } from "@repo/shared/schema"
import { subscriptionValidator } from "@repo/shared/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

type CouponCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initial?: TSchemaSubscription.TSubscriptionRepository.TCouponWithRelationSelect
}

const formSchema = subscriptionValidator.createCouponSchema

type FormValues = z.infer<typeof formSchema>

export function CouponCrudModal({ isOpen, setIsOpen, initial }: CouponCrudModalProps) {
    const trpc = useTRPC()

    const queryClient = useQueryClient()

    function onSuccsesCrud() {
        setIsOpen(false)
        queryClient.invalidateQueries(trpc.subscription.getCouponsWithPagination.queryFilter())
    }

    const createCoupon = useMutation(trpc.subscription.createCoupon.mutationOptions({
        onSuccess: () => {
            onSuccsesCrud()
        }
    }))

    const updateCoupon = useMutation(trpc.subscription.updateCoupon.mutationOptions({
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
            createCoupon.mutate(data)
        } else {
            updateCoupon.mutate({
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
            const { userDiscounts, ...couponData } = initial
            form.reset({
                couponData: couponData
            })
        } else {
            form.reset()
        }
    }, [isOpen, initial])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isCreate ? "Create Coupon" : "Edit Coupon"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="couponData.code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SUMMER2024" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="couponData.discount_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}>
                                            <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-2">
                                                <SelectValue placeholder="Select a discount type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SahredEnums.SelectData.Discount_TypeData.map((discountType) => (
                                                    <SelectItem key={discountType.value} value={discountType.value}>
                                                        {discountType.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="couponData.value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="couponData.duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration</FormLabel>
                                    <FormControl>
                                        <Input placeholder="forever" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="couponData.duration_in_months"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration in Months (Optional)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="couponData.store_offer_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store Offer ID (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="offer_123" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
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

export default CouponCrudModal
