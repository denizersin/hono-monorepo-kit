"use client"

import { TUserValidator } from "@repo/shared/validators"
import { useState } from "react"

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
import UserCrudModal from "./user-crud-modal"
import { CustomPagination } from "@/components/dashboard/custom-pagination"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, User } from "lucide-react"
import { DeleteUserModal } from "./delete-user-modal"

type UserWithoutPassword = Omit<TUserValidator.TblUserSelect, 'password'>

export const UserList = () => {
    const trpc = useTRPC()

    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserWithoutPassword | undefined>(undefined)

    const [query, setQuery] = useState<TUserValidator.TUserPaginationQuery>({
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
    } = useQuery(trpc.user.getAllUsers.queryOptions(query))

    const data = paginationData?.data
    const pagination = paginationData?.pagination

    const handleEdit = (user: UserWithoutPassword) => {
        setSelectedUser(user)
        setIsOpen(true)
    }

    const handleDelete = (user: UserWithoutPassword) => {
        setSelectedUser(user)
        setIsDeleteOpen(true)
    }

    const handleCreate = () => {
        setSelectedUser(undefined)
        setIsOpen(true)
    }

    return (
        <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                        <p className="text-sm text-muted-foreground">Manage your company users</p>
                    </div>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            {isOpen && (
                <UserCrudModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    initial={selectedUser}
                />
            )}

            {isDeleteOpen && selectedUser && (
                <DeleteUserModal
                    isOpen={isDeleteOpen}
                    setIsOpen={setIsDeleteOpen}
                    user={selectedUser}
                />
            )}

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.fullPhone}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'OWNER' ? 'default' : user.role === 'ADMIN' ? 'secondary' : 'outline'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(user)}
                                                disabled={user.role === 'OWNER' || user.role === 'ADMIN'}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(user)}
                                                disabled={user.role === 'OWNER' || user.role === 'ADMIN' || user.role==="SUPER_ADMIN"}
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

