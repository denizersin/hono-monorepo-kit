
import { z } from "zod"
import { userValidator } from "../user";

const loginEmailAndPasswordFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

const registerFormSchema = userValidator.userBaseInsertSchema.pick({
    email: true,
    password: true,
    phoneCodeId: true,
    phoneNumber: true,
    name: true,
    surname: true,
})


const verifyCodeFormSchema = z.object({
    code: z.number().min(6),
    registerForm: registerFormSchema,
})



export const authValidator = {
    loginEmailAndPasswordFormSchema,
    registerFormSchema,
    verifyCodeFormSchema
}
 




export namespace TAuthValidator {
    export type TLoginEmailAndPasswordFormSchema = z.infer<typeof loginEmailAndPasswordFormSchema>;
    export type TRegisterFormSchema = z.infer<typeof registerFormSchema>;
    export type TVerifyCodeFormSchema = z.infer<typeof verifyCodeFormSchema>;
}


