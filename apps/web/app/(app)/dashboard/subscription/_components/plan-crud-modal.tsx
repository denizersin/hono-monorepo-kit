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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrenciesSelectData, getPlanIntervalsSelectData, useGetCompanyLanguages } from "@/hooks/constant-queries"
import { TSchemaSubscription } from "@repo/shared/schema"
import { subscriptionValidator } from "@repo/shared/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

type PlanCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initial?: TSchemaSubscription.TSubscriptionRepository.TPlanWithRelationSelect
}



// Build a simple form schema for plan data and translation names
const formSchema = subscriptionValidator.createPlanWithTranslationSchema

type FormValues = z.infer<typeof formSchema>

export function PlanCrudModal({ isOpen, setIsOpen, initial }: PlanCrudModalProps) {
    const trpc = useTRPC()

    const [isReset, setIsReset] = useState(false)

    const queryClient = useQueryClient()
    console.log(initial, 'initial')

    function onSuccsesCrud() {
        setIsOpen(false)
        queryClient.invalidateQueries(trpc.subscription.getPlansWithPagination.queryFilter())
    }


    const { data: languages, isLoading } = useGetCompanyLanguages()



    const createPlanWithTranslation = useMutation(trpc.subscription.createPlanWithTranslation.mutationOptions({
        onSuccess: () => {
            onSuccsesCrud()
        }
    }))

    const updatePlanWithTranslation = useMutation(trpc.subscription.updatePlanWithTranslation.mutationOptions({
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
            createPlanWithTranslation.mutate(data)
        } else {
            updatePlanWithTranslation.mutate({
                id: initial!.id,
                data: {
                    planData: data.planData,
                    translations: data.translations.map((t) => ({ ...t, planId: initial!.id })),
                }
            })
        }
    }

    console.log(form.formState.errors, 'errors')
    console.log(form.getValues(), 'values')

    useEffect(() => {

        console.log('runnnnn')

        if (!isOpen) {
            return form.reset()
        }

        if (initial) {
            console.log(initial, 'initial222')
            const { translations, ...planData } = initial
            form.reset({
                planData,
                translations: languages?.map(language => {
                    const translation = translations.find(t => t.languageId === language.id)
                    if (translation) {
                        return {
                            name: translation.name,
                            description: translation.description,
                            languageId: language.id
                        }
                    } else return undefined
                })
            })

            console.log(form.getValues(), 'form.getValues()')
        } else {
            console.log('reset')
            form.reset()
        }
    }, [isOpen, initial, isLoading])



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isCreate ? "Create Plan" : "Edit Plan"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="planData.name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Basic Plan" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="planData.price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="planData.currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a currency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {getCurrenciesSelectData().map((currency) => (
                                                <SelectItem key={currency.value} value={currency.value}>
                                                    {currency.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="planData.interval"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Interval</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an interval" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {getPlanIntervalsSelectData().map((interval) => (
                                                <SelectItem key={interval.value} value={interval.value}>
                                                    {interval.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="planData.intervalCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Interval Count</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="planData.trialPeriodDays"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trial Period Days</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="planData.active"
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
                                        name={`translations.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{language.name} - Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`${language.name} name`} {...field}
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

export default PlanCrudModal
