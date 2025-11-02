import { tblCompany, tblCompanyLanguage, TSchemaCompany } from "@repo/shared/schema"
import db from "../../database"
import { eq } from "drizzle-orm"

export class CompanyRepositoryImpl {
    async createCompany(company: TSchemaCompany.TTblCompanyInsert) {
        const [newCompany] = await db.insert(tblCompany).values(company).returning({ id: tblCompany.id })
        return newCompany?.id!
    }

    // we will relate translations to tblLanguage.id not tblCompany.language.id
    // this is just to know which language is used in the company

    async updateCompanyLanguages(companyLanguages: TSchemaCompany.TCompanyRepositoryTypes.updateCompanyLanguages) {

        await db.delete(tblCompanyLanguage).where(eq(tblCompanyLanguage.companyId, companyLanguages.companyId))
        console.log(companyLanguages.languages, 'companyLanguages')
        const promises = companyLanguages.languages.map(async (languageId) => {
            await db.insert(tblCompanyLanguage).values({
                companyId: companyLanguages.companyId,
                languageId: languageId
            })
        })
        await Promise.all(promises)
    }
}       