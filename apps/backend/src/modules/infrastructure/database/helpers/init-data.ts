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
        const languageEnumKeys = SahredEnums.getMapKeysForZod(SahredEnums.LANGUAGE_MAP)

        const languageData = _languageData as { code: string, name: string }[]
        languageData.sort((a, b) => {

            //if is app language, then it should be first to sync id
            const isMyEnumValue = languageEnumKeys.some(v => v === a.code)
            const isMyEnumValue2 = languageEnumKeys.some(v => v === b.code)
            if (isMyEnumValue && isMyEnumValue2) {
                return 0
            }
            return isMyEnumValue ? -1 : 1
        })
        const languageDataInsert = languageData.map(language => {
            const isMyEnumValue = languageEnumKeys.some(v => v === language.code)
            return {
                name: language.name,
                code: language.code,
                id: isMyEnumValue ? SahredEnums.getMapId(SahredEnums.LANGUAGE_MAP, language.code as TLanguage) : undefined
            }
        })

        const myLanguagesData = languageDataInsert.filter(l => l.id !== undefined)

        await db.insert(tblLanguage).values(myLanguagesData)
    }

    static async initializeDbPrededfinedDatas() {
        await this.initializeCountryData()
        await this.initializeLanguageData()
    }
}