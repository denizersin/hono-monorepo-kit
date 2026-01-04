import { TSchemaData, tblCompanyLanguage } from "@repo/shared/schema"
import db from "@server/modules/infrastructure/database/index"
import { eq } from "drizzle-orm"

export class LanguageRepository {
    async getLanguages(): Promise<TSchemaData.TTblLanguage[]> {
        const languages = await db.query.tblLanguage.findMany()
        return languages
    }
    async getCompanyLanguages({companyId}:{companyId:number}): Promise<TSchemaData.TTblLanguage[]> {
        const languages = await db.query.tblCompanyLanguage.findMany({
            with: {
                language: true
            },
            where: eq(tblCompanyLanguage.companyId, companyId)
        })
        return languages.map(l => l.language)
    }
}