import { ZodSchema } from "zod"

export const validateInput = ({
    condition,
    validator
}: ({
    condition: () => boolean,
    validator: {
        schema: ZodSchema,
        errorMessage?: string
    }
})) => {

}