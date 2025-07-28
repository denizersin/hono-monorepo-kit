import db from "@server/modules/infrastructure/database"
import _countryData from '@server/data/db/country.json'
import _languageData from '@server/data/db/language.json'
import { tblCountry, tblLanguage, TSchemaData } from "@repo/shared/schema";
import { SahredEnums } from "@repo/shared/enums";
import { TLanguage } from "@repo/shared/types";

// const countryData = _countryData 
export class InitializeDbPrededfinedDatas {

    static async initializeCountryData() {
        console.log("initializeCountryData")
        const countryData = _countryData as TSchemaData.TTblCountry[]
        const countryDataInsert = countryData.map(country => ({
            name: country.name,
            phoneCode: country.phoneCode,
            code: country.code
        }))
        await db.insert(tblCountry).values(countryDataInsert)
        console.log("initializeCountryData completed")
    }

    static async initializeLanguageData() {
        const languageEnumValues = SahredEnums.getStringEnumValuesForZod(SahredEnums.Language)

        const languageData = _languageData as { code: string, name: string }[]
        languageData.sort((a, b) => {

            //if is app language, then it should be first to sync id
            const isMyEnumValue = languageEnumValues.some(v => v === a.code)
            const isMyEnumValue2 = languageEnumValues.some(v => v === b.code)
            if (isMyEnumValue && isMyEnumValue2) {
                return 0
            }
            return isMyEnumValue ? -1 : 1
        })
        const languageDataInsert = languageData.map(language => {
            const isMyEnumValue = languageEnumValues.some(v => v === language.code)
            return {
                name: language.name,
                code: language.code,
                id: isMyEnumValue ? SahredEnums.LanguageId[language.code as TLanguage] : undefined
            }
        })
        await db.insert(tblLanguage).values(languageDataInsert)
    }

    static async initializeDbPrededfinedDatas() {
        await this.initializeCountryData()
        await this.initializeLanguageData()
    }
}