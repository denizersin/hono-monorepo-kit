import { zValidator } from "@hono/zod-validator"
import { wpClientValidator } from "@repo/shared/validators"
import { createSuccessResponse } from "@server/lib/errors"
import honoFactory, { createHonoApp } from "@server/lib/hono/hono-factory"
import { CountryRepository } from "@server/modules/infrastructure/repositories/data/CountryRepository"



const countryRepository = new CountryRepository()

const constantsApp = createHonoApp()

    .get('/countries',
        async (c) => {
            const countries = await countryRepository.getCountries()
            return c.json(createSuccessResponse(countries))
        })




export default constantsApp