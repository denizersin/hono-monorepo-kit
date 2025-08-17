import type { TAuthValidator } from "@repo/shared/validators"
import { Button } from "@web/components/ui/button"
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription } from "@web/components/ui/dialog"
import { Input } from "@web/components/ui/input"
import { useTRPC } from "@web/components/providers/trpc/trpc-provider"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

type OtpModalProps = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    registerFormData: TAuthValidator.TRegisterFormSchema
}

export const OtpModal = ({ isOpen, setIsOpen, registerFormData }: OtpModalProps) => {
    const trpc = useTRPC()
    const [otp, setOtp] = useState('')

    const { mutate: verifyCode, isPending, error, isError } = useMutation(trpc.auth.verifyCode.mutationOptions({
        onSuccess: () => {
            setIsOpen(false)
        },
        onError: (error) => {
            console.log('onError')
            setOtp('')
        }
    }))



    function handleVerifyCode() {
        verifyCode({
            code: parseInt(otp),
            registerForm: registerFormData
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter the code sent to your phone</DialogTitle>
                </DialogHeader>
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} />

                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => {
                        // TODO: Implement resend verification code
                    }}>
                        Send again
                    </Button>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleVerifyCode} disabled={isPending}>Verify</Button>
                </div>
            </DialogContent>
        </Dialog >
    )
}