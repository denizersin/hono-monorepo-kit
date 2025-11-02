import { TSchemaData, tblCompanyLanguage } from "@repo/shared/schema"
import db from "@server/modules/infrastructure/database/index"

export class LanguageRepository {
    async getLanguages(): Promise<TSchemaData.TTblLanguage[]> {
        const languages = await db.query.tblLanguage.findMany()
        return languages
    }
    async getCompanyLanguages(): Promise<TSchemaData.TTblLanguage[]> {
        const languages = await db.query.tblCompanyLanguage.findMany({
            with: {
                language: true
            }
        })
        return languages.map(l => l.language)
    }
}