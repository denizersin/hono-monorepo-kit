import db from "@server/modules/infrastructure/database"
import _countryData from '@server/data/db/country.json'
import { tblCountry, TSchemaData } from "@repo/shared/schema";

// const countryData = _countryData 
export class InitializeDbData {

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

    static async initializeDbData() {
        await this.initializeCountryData()
    }
}