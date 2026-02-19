"use client"

import { TUserValidator } from "@repo/shared/validators"
import { useState, useMemo } from "react"

import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { CustomPagination } from "@/components/dashboard/custom-pagination"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, ShieldCheck } from "lucide-react"
import { RolePermissionCrudModal } from "./role-permission-crud-modal"
import { DeleteRolePermissionModal } from "./delete-role-permission-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type RolePermission = TUserValidator.TRolePermissionSelect

export const RolePermissionList = () => {
    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedRolePermission, setSelectedRolePermission] = useState<RolePermission | undefined>(undefined)

    const [query, setQuery] = useState<TUserValidator.TRolePermissionPaginationQuery>({
        pagination: {
            page: 1,
            limit: 10,
        },
        sort: [{
            sortBy: 'desc',
            sortField: 'createdAt'
        }],
        filter: {},
    })

    const {
        data: paginationData,
        isLoading
    } = useQuery(trpc.user.getRolePermissions.queryOptions(query))

    const { data: roles } = useQuery(trpc.user.getAllRoles.queryOptions())
    const { data: permissions } = useQuery(trpc.user.getAllPermissions.queryOptions())

    const rolesMap = useMemo(() => {
        return roles?.reduce((acc, role) => {
            acc[role.id] = role.name
            return acc
        }, {} as Record<number, string>) ?? {}
    }, [roles])

    const permissionsMap = useMemo(() => {
        return permissions?.reduce((acc, permission) => {
            acc[permission.id] = permission.name
            return acc
        }, {} as Record<number, string>) ?? {}
    }, [permissions])

    const data = paginationData?.data
    const pagination = paginationData?.pagination


    const handleDelete = (rp: RolePermission) => {
        setSelectedRolePermission(rp)
        setIsDeleteOpen(true)
    }

    const handleCreate = () => {
        setIsOpen(true)
    }

    return (
        <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Role Permissions</h1>
                            <p className="text-sm text-muted-foreground">Manage permissions for each role</p>
                        </div>
                    </div>
                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Permission
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={query.filter?.roleId?.toString() ?? "all"}
                        onValueChange={(val) => {
                            setQuery(prev => ({
                                ...prev,
                                filter: {
                                    ...prev.filter,
                                    roleId: val === "all" ? undefined : Number(val)
                                },
                                pagination: { ...prev.pagination, page: 1 }
                            }))
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {roles?.map((role) => (
                                <SelectItem key={role.id} value={role.id.toString()}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={query.filter?.permissionId?.toString() ?? "all"}
                        onValueChange={(val) => {
                            setQuery(prev => ({
                                ...prev,
                                filter: {
                                    ...prev.filter,
                                    permissionId: val === "all" ? undefined : Number(val)
                                },
                                pagination: { ...prev.pagination, page: 1 }
                            }))
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by Permission" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Permissions</SelectItem>
                            {permissions?.map((permission) => (
                                <SelectItem key={permission.id} value={permission.id.toString()}>
                                    {permission.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>

            {isOpen && (
                <RolePermissionCrudModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}

            {isDeleteOpen && selectedRolePermission && (
                <DeleteRolePermissionModal
                    isOpen={isDeleteOpen}
                    setIsOpen={setIsDeleteOpen}
                    rolePermission={selectedRolePermission}
                    roleName={rolesMap[selectedRolePermission.roleId] || 'Unknown Role'}
                    permissionName={permissionsMap[selectedRolePermission.permissionId] || 'Unknown Permission'}
                />
            )}

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Role</TableHead>
                            <TableHead>Permission</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No role permissions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((rp) => (
                                <TableRow key={`${rp.roleId}-${rp.permissionId}`}>
                                    <TableCell>
                                        <Badge variant="outline" className="font-medium">
                                            {rolesMap[rp.roleId] || rp.roleId}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-medium">
                                            {permissionsMap[rp.permissionId] || rp.permissionId}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(rp.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(rp)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="mt-4">
                    <CustomPagination
                        paginationData={pagination}
                        pagination={query}
                        setPagination={(p) => setQuery({ ...query, pagination: p.pagination })}
                    />
                </div>
            )}
        </div>
    )
}
