"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { characterValidator, type TCharacterValidator } from "@repo/shared/validators"
import { z } from "zod"
import { TSchemaCharacter } from "@repo/shared/schema"

type PersonaCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initialData?: TSchemaCharacter.TCharacterRepositoryTypes.TPersonaWithTranslations
}

// Build a simple form schema for persona data and translation names
const formSchema = characterValidator.createPersonaWithTranslationSchema

type FormValues = z.infer<typeof formSchema>

export function PersonaCrudModal({ isOpen, setIsOpen, initialData }: PersonaCrudModalProps) {
    const trpc = useTRPC()


    // Load languages to resolve en/tr ids
    const { data: languages } = useQuery(trpc.constants.getLanguages.queryOptions())
    const sortedLanguages = useMemo(() => {
        return languages?.sort((a, b) => a.id - b.id)
    }, [languages])
    const createPersonaWithTranslation = useMutation(trpc.character.createPersonaWithTranslation.mutationOptions({
        onSuccess: () => {
            setIsOpen(false)
        }
    }))

    const updatePersonaWithTranslation = useMutation(trpc.character.updatePersonaWithTranslation.mutationOptions({
        onSuccess: () => {
            setIsOpen(false)
        }
    }))



    const isCreate = useMemo(() => {
        return !initialData
    }, [initialData])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? initialData : undefined,
    })

    const onSubmit = (data: FormValues) => {
        if (isCreate) {
            createPersonaWithTranslation.mutate(data)
        } else {
            updatePersonaWithTranslation.mutate({
                id: initialData!.id,
                data: {
                    personaData: data.personaData,
                    translations: data.translations.map((t) => ({ ...t, personaId: initialData!.id })),
                }
            })
        }
    }

    console.log(form.formState.errors, 'errors')
    console.log(form.getValues(), 'values')

    useEffect(() => {
        if (initialData) {
            const { translations, ...personaData } = initialData

            form.setValue('personaData', personaData)

            const defaultFormTranslations = form.getValues('translations')

            defaultFormTranslations.forEach((t, index) => {
                const initialTranslation = initialData.translations.find((it) => it.languageId === t.languageId)
                if (initialTranslation) {
                    defaultFormTranslations[index] = initialTranslation
                }
            })

            form.setValue('translations', defaultFormTranslations)

        } else {
            form.reset()
            console.log('reset')
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isCreate ? "Create Persona" : "Edit Persona"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="personaData.name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Default persona name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="personaData.imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {sortedLanguages?.map((language, index) => (
                            <FormField
                                control={form.control}
                                name={`translations.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{language.name}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={`${language.name} name`} {...field}
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
                        ))}
                        {/* 
                        <FormField
                            control={form.control}
                            name="translations.0.name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name (EN)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="English name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="translations.1.name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name (TR)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Türkçe ad" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

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

export default PersonaCrudModal


