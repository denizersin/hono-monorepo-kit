import { LookUpEnumsValidation } from "@server/modules/domain/validate-lookup/validateLookUp"
import db from "@server/modules/infrastructure/database"
import { schema } from "@server/modules/infrastructure/database/schema"
import { SahredEnums } from "@repo/shared/enums"




async function initializeDb() {

    //insert lookup enums
    console.log("initializeLookUpToDb")
    await LookUpEnumsValidation.initializeLookUpToDb()
    console.log("initializeLookUpToDb completed")

    process.exit(0)
}

initializeDb()