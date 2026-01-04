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

type UserWithoutPassword = Omit<TUserValidator.TblUserSelect, 'password'>

type DeleteUserModalProps = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    user: UserWithoutPassword
}

export function DeleteUserModal({ isOpen, setIsOpen, user }: DeleteUserModalProps) {
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const deleteUser = useMutation(trpc.user.deleteUser.mutationOptions({
        onSuccess: () => {
            setIsOpen(false)
            queryClient.invalidateQueries(trpc.user.getAllUsers.queryFilter())
        }
    }))

    const handleDelete = () => {
        deleteUser.mutate({ id: user.id })
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
                            <DialogTitle>Delete User</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-foreground">{user.fullName}</span>?
                        This will remove all their data from the system.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={deleteUser.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteUser.isPending}
                    >
                        {deleteUser.isPending ? "Deleting..." : "Delete User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

