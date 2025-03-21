
import { z } from "zod"
import { userValidator } from "../user";

const loginEmailAndPasswordFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

const registerFormSchema = userValidator.userBaseInsertSchema.omit({
    role: true,
    companyId: true,
})





export const authValidator = {
    loginEmailAndPasswordFormSchema,
    registerFormSchema,
}





export namespace TAuthValidator {
    export type TLoginEmailAndPasswordFormSchema = z.infer<typeof loginEmailAndPasswordFormSchema>;
    export type TRegisterFormSchema = z.infer<typeof registerFormSchema>;
}


