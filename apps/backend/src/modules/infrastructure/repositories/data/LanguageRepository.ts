import { TSchemaData } from "@repo/shared/schema"
import db from "@server/modules/infrastructure/database/index"

export class LanguageRepository {
    async getLanguages(): Promise<TSchemaData.TTblLanguage[]> {
        const languages = await db.query.tblLanguage.findMany()
        return languages
    }
}