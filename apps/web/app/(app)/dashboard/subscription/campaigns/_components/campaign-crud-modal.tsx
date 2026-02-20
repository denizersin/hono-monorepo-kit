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
import { useGetCompanyLanguages } from "@/hooks/constant-queries"
import { useGetAllPlans } from "@/hooks/constant-queries"
import { TSchemaSubscription } from "@repo/shared/schema"
import { subscriptionValidator } from "@repo/shared/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

type CampaignCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initial?: TSchemaSubscription.TSubscriptionRepository.TCampaignWithRelationSelect
}

const formSchema = subscriptionValidator.createCampaignWithTranslationSchema

type FormValues = z.infer<typeof formSchema>

export function CampaignCrudModal({ isOpen, setIsOpen, initial }: CampaignCrudModalProps) {
    const trpc = useTRPC()

    const queryClient = useQueryClient()

    function onSuccsesCrud() {
        setIsOpen(false)
        queryClient.invalidateQueries(trpc.subscription.getCampaignsWithPagination.queryFilter())
    }

    const { data: languages, isLoading } = useGetCompanyLanguages()
    const { data: plans } = useGetAllPlans()

    const createCampaignWithTranslation = useMutation(trpc.subscription.createCampaignWithTranslation.mutationOptions({
        onSuccess: () => {
            onSuccsesCrud()
        }
    }))

    const updateCampaignWithTranslation = useMutation(trpc.subscription.updateCampaignWithTranslation.mutationOptions({
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
            createCampaignWithTranslation.mutate(data)
        } else {
            updateCampaignWithTranslation.mutate({
                id: initial!.id,
                data: {
                    campaignData: data.campaignData,
                    translations: data.translations.map((t) => ({ ...t, campaignId: initial!.id })),
                }
            })
        }
    }

    useEffect(() => {
        if (!isOpen) {
            return form.reset()
        }

        if (initial) {
            const { translations, plan, ...campaignData } = initial
            form.reset({
                campaignData,
                translations: languages?.map(language => {
                    const translation = translations.find(t => t.languageId === language.id)
                    if (translation) {
                        return {
                            title: translation.title,
                            description: translation.description,
                            languageId: language.id
                        }
                    } else return undefined
                })
            })
        } else {
            form.reset()
        }
    }, [isOpen, initial, isLoading])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isCreate ? "Create Campaign" : "Edit Campaign"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="campaignData.title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Summer Sale" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="campaignData.discount_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Type</FormLabel>
                                    <FormControl>
                                        <Input placeholder="percentage" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="campaignData.value"
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
                            name="campaignData.target_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Type</FormLabel>
                                    <FormControl>
                                        <Input placeholder="all_plans" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="campaignData.plan_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan (Optional)</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                                        >
                                            <option value="">All plans</option>
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
                            name="campaignData.start_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
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
                            name="campaignData.end_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
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
                            name="campaignData.is_active"
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

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Translations</h3>
                            {languages?.map((language, index) => (
                                <div key={language.id} className="space-y-2 p-4 border rounded-lg">
                                    <FormField
                                        control={form.control}
                                        name={`translations.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{language.name} - Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`${language.name} title`} {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            form.setValue(`translations.${index}.languageId`, language.id)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`translations.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{language.name} - Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`${language.name} description`} {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            form.setValue(`translations.${index}.languageId`, language.id)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>

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

export default CampaignCrudModal
