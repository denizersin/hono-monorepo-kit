"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TUserValidator, userValidator } from "@repo/shared/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

type UserWithoutPassword = Omit<TUserValidator.TblUserSelect, 'password'>

type UserCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initial?: UserWithoutPassword
}

// Create form schema - for creating new users
const createFormSchema = userValidator.ownerCreateUserSchema

// Update form schema - for updating existing users
const updateFormSchema = userValidator.ownerUpdateUserSchema

type CreateFormValues = z.infer<typeof createFormSchema>
type UpdateFormValues = z.infer<typeof updateFormSchema>

export function UserCrudModal({ isOpen, setIsOpen, initial }: UserCrudModalProps) {
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const isCreate = useMemo(() => !initial, [initial])

    function onSuccessCrud() {
        setIsOpen(false)
        queryClient.invalidateQueries(trpc.user.getAllUsers.queryFilter())
    }

    const createUser = useMutation(trpc.user.createUserAsOwner.mutationOptions({
        onSuccess: () => {
            onSuccessCrud()
        }
    }))

    const updateUser = useMutation(trpc.user.updateUser.mutationOptions({
        onSuccess: () => {
            onSuccessCrud()
        }
    }))

    // Use a combined form approach - separate handling for create vs update
    const createForm = useForm<CreateFormValues>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            password: '',
            phoneNumber: '',
            phoneCodeId: 1,
            fullName: '',
            fullPhone: '',
            invitationCode: '',
            test: '',
            mailConfirmationStatusId: 1,
        }
    })

    const updateForm = useForm<UpdateFormValues>({
        resolver: zodResolver(updateFormSchema),
    })

    const onCreateSubmit = (data: CreateFormValues) => {
        // Generate fullName from name and surname
        const fullName = `${data.name} ${data.surname}`
        const fullPhone = `+${data.phoneCodeId}${data.phoneNumber}`
        
        createUser.mutate({
            ...data,
            fullName,
            fullPhone,
        })
    }

    const onUpdateSubmit = (data: UpdateFormValues) => {
        if (!initial) return
        
        // Generate fullName if name or surname changed
        const fullName = data.name || data.surname 
            ? `${data.name || initial.name} ${data.surname || initial.surname}`
            : undefined
        const fullPhone = data.phoneNumber 
            ? `+${data.phoneCodeId || initial.phoneCodeId}${data.phoneNumber}`
            : undefined
            
        updateUser.mutate({
            id: initial.id,
            data: {
                ...data,
                ...(fullName && { fullName }),
                ...(fullPhone && { fullPhone }),
            }
        })
    }

    useEffect(() => {
        if (!isOpen) {
            createForm.reset()
            updateForm.reset()
            return
        }

        if (initial) {
            updateForm.reset({
                name: initial.name,
                surname: initial.surname,
                email: initial.email,
                phoneNumber: initial.phoneNumber,
                phoneCodeId: initial.phoneCodeId,
            })
        } else {
            createForm.reset()
        }
    }, [isOpen, initial])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isCreate ? "Create New User" : "Edit User"}</DialogTitle>
                </DialogHeader>
                
                {isCreate ? (
                    <Form {...createForm}>
                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={createForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="surname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={createForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={createForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Min 8 characters" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={createForm.control}
                                    name="phoneCodeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="90" 
                                                    {...field} 
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="col-span-2">
                                    <FormField
                                        control={createForm.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="5551234567" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createUser.isPending}>
                                    {createUser.isPending ? "Creating..." : "Create User"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <Form {...updateForm}>
                        <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={updateForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
                                    name="surname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} value={field.value ?? ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={updateForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john.doe@example.com" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={updateForm.control}
                                    name="phoneCodeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="90" 
                                                    {...field} 
                                                    value={field.value ?? ''}
                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="col-span-2">
                                    <FormField
                                        control={updateForm.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="5551234567" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={updateUser.isPending}>
                                    {updateUser.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default UserCrudModal

