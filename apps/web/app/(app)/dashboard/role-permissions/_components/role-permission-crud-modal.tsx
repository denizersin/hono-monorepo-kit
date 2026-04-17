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
import { Checkbox } from "@/components/ui/checkbox"


type RolePermissionCrudModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const createFormSchema = userValidator.createBulkRolePermissionSchema

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

    const createBulkRolePermission = useMutation(trpc.user.createBulkRolePermission.mutationOptions({
        onSuccess: () => {
            onSuccessCrud()
        }
    }))

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            roleId: undefined,
            permissionIds: [], // array for multiple permissions
        }
    })

    const selectedRoleId = form.watch("roleId")

    const { data: existingRolePermissions } = useQuery({
        ...trpc.user.getRolePermissions.queryOptions({
            pagination: {
                page: 1,
                limit: 1000,
            },
            sort: [{
                sortBy: 'desc',
                sortField: 'createdAt'
            }],
            filter: {
                roleId: selectedRoleId
            },
        }),
        enabled: !!selectedRoleId,
    })

    useEffect(() => {
        if (existingRolePermissions?.data) {
            const existingPermissionIds = existingRolePermissions.data.map(rp => rp.permissionId)
            form.setValue("permissionIds", existingPermissionIds)
        } else if (!selectedRoleId) {
            form.setValue("permissionIds", [])
        }
    }, [existingRolePermissions?.data, selectedRoleId, form])

    const onSubmit = (data: CreateFormValues) => {
        createBulkRolePermission.mutate(data)
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
                            name="permissionIds"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Permissions</FormLabel>
                                    </div>
                                    <div className="max-h-[200px] overflow-y-auto border p-2 rounded-md space-y-2">
                                        {permissions?.map((permission) => (
                                            <FormField
                                                key={permission.id}
                                                control={form.control}
                                                name="permissionIds"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={permission.id}
                                                            className="flex flex-row items-center space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(permission.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, permission.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== permission.id
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal text-sm cursor-pointer">
                                                                {permission.name}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createBulkRolePermission.isPending}>
                                {createBulkRolePermission.isPending ? "Adding..." : "Add Permissions"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
