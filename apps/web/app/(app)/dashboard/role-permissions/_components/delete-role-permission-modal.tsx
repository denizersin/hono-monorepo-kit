"use client"

import { useTRPC } from "@/components/providers/trpc/trpc-provider"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { TUserValidator } from "@repo/shared/validators"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle } from "lucide-react"

type RolePermission = TUserValidator.TRolePermissionSelect

type DeleteRolePermissionModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    rolePermission: RolePermission
    roleName: string
    permissionName: string
}

export function DeleteRolePermissionModal({ isOpen, setIsOpen, rolePermission, roleName, permissionName }: DeleteRolePermissionModalProps) {
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const deleteRolePermission = useMutation(trpc.user.deleteRolePermission.mutationOptions({
        onSuccess: () => {
            setIsOpen(false)
            queryClient.invalidateQueries(trpc.user.getRolePermissions.queryFilter())
        }
    }))

    const handleDelete = () => {
        deleteRolePermission.mutate({
            roleId: rolePermission.roleId,
            permissionId: rolePermission.permissionId
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <DialogTitle>Delete Role Permission</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to remove permission{" "}
                        <span className="font-medium text-foreground">{permissionName}</span> from role{" "}
                        <span className="font-medium text-foreground">{roleName}</span>?
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={deleteRolePermission.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteRolePermission.isPending}
                    >
                        {deleteRolePermission.isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
