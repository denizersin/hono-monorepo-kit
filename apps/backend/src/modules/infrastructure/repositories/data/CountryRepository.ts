import { tblCountry, TSchemaData } from "@repo/shared/schema"
import { CustomError } from "@server/lib/errors"
import db from "@server/modules/infrastructure/database/index"

//TODO add interface 
export class CountryRepository {
    async getCountryById(id: number): Promise<TSchemaData.TTblCountry> {
        const country = await db.query.tblCountry.findFirst({
        })
        tblCountry
        if (!country) {
            throw new CustomError({ message: 'country not found', errorCode: 'NOT_FOUND' })
        }
        return country
    }
    async getCountries(): Promise<TSchemaData.TTblCountry[]> {
        const countries = await db.query.tblCountry.findMany()
        return countries
    }
}