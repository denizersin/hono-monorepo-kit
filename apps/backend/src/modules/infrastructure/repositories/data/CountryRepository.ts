import schema, { TSchemaData } from "@server/modules/infrastructure/database/schema"
import db from "@server/modules/infrastructure/database/index"
import { eq } from "drizzle-orm"
import { CustomError } from "@server/lib/errors"

//TODO add interface 
export class CountryRepository {
    async getCountryById(id: number): Promise<TSchemaData.TTblCountry> {
        const country = await db.query.tblCountry.findFirst({
            where: eq(schema.tblCountry.id, id)
        })
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