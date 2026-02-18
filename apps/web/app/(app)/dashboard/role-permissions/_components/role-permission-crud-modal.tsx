"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TUserValidator, userValidator } from "@repo/shared/validators"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { z } from "zod"


type RolePermissionCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const createFormSchema = userValidator.rolePermissionBaseInsertSchema

type CreateFormValues = z.infer<typeof createFormSchema>

export function RolePermissionCrudModal({ isOpen, setIsOpen }: RolePermissionCrudModalProps) {
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { data: roles } = useQuery(trpc.user.getAllRoles.queryOptions())
    const { data: permissions } = useQuery(trpc.user.getAllPermissions.queryOptions())

    function onSuccessCrud() {
        setIsOpen(false)
        queryClient.invalidateQueries(trpc.user.getRolePermissions.queryFilter())
    }

    const createRolePermission = useMutation(trpc.user.createRolePermission.mutationOptions({
        onSuccess: () => {
            onSuccessCrud()
        }
    }))

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            roleId: undefined,
            permissionId: undefined,
        }
    })

    const onSubmit = (data: CreateFormValues) => {
        createRolePermission.mutate(data)
    }

    useEffect(() => {
        if (!isOpen) {
            form.reset()
        }
    }, [isOpen, form])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Role Permission</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="roleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roles?.map((role) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {role.name}
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
                            name="permissionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permission</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a permission" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {permissions?.map((permission) => (
                                                <SelectItem key={permission.id} value={permission.id.toString()}>
                                                    {permission.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createRolePermission.isPending}>
                                {createRolePermission.isPending ? "Adding..." : "Add Permission"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
