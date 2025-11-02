"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TSchemaCharacter } from "@repo/shared/schema"
import { characterValidator } from "@repo/shared/validators"
import { useMutation, useQuery } from "@tanstack/react-query"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"
import { useGetCompanyLanguages, useGetLanguages } from "@/hooks/constant-queries"

type PersonaCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initial?: TSchemaCharacter.TCharacterRepositoryTypes.TPersonaWithTranslations
}

// Build a simple form schema for persona data and translation names
const formSchema = characterValidator.createPersonaWithTranslationSchema

type FormValues = z.infer<typeof formSchema>

export function PersonaCrudModal({ isOpen, setIsOpen, initial }: PersonaCrudModalProps) {
    const trpc = useTRPC()

    const [isReset, setIsReset] = useState(false)

    const queryClient = useQueryClient()
    console.log(initial, 'initial')

    function onSuccsesCrud() {
        setIsOpen(false)
        queryClient.invalidateQueries(trpc.character.getAllPersonasWithTranslations.queryFilter())
    }


    const { data: languages } = useGetCompanyLanguages()



    const createPersonaWithTranslation = useMutation(trpc.character.createPersonaWithTranslation.mutationOptions({
        onSuccess: () => {
            onSuccsesCrud()
        }
    }))

    const updatePersonaWithTranslation = useMutation(trpc.character.updatePersonaWithTranslation.mutationOptions({
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
            createPersonaWithTranslation.mutate(data)
        } else {
            updatePersonaWithTranslation.mutate({
                id: initial!.id,
                data: {
                    personaData: data.personaData,
                    translations: data.translations.map((t) => ({ ...t, personaId: initial!.id })),
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
            const { translations, ...personaData } = initial
            form.reset({
                personaData,
                translations: languages?.map(language => {
                    const translation = translations.find(t => t.languageId === language.id)
                    if (translation) {
                        return {
                            name: translation.name,
                            languageId: language.id
                        }
                    } else return undefined
                })
            })
        } else {
            console.log('reset')
            form.reset()
        }
    }, [isOpen, initial])




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

                        {languages?.map((language, index) => (
                            <FormField
                                control={form.control}
                                name={`translations.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{language.name}</FormLabel>
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


