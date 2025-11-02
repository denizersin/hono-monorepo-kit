import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { tblCompany } from "../../schema";

const companyBaseSelectSchema = createSelectSchema(tblCompany)
const companyBaseInsertSchema = createInsertSchema(tblCompany)
const updateCompanyLanguagesSchema = z.object({
    companyId: z.number(),
    languages: z.array(z.number())
})

export const companyValidator = {
    companyBaseSelectSchema,
    companyBaseInsertSchema,
    updateCompanyLanguagesSchema
}





export namespace TCompanyValidator {
    export type TCreateCompanySchema = z.infer<typeof companyBaseInsertSchema>
    export type TUpdateCompanyLanguagesSchema = z.infer<typeof updateCompanyLanguagesSchema>
}