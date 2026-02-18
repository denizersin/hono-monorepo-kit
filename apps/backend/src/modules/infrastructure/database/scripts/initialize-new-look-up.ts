import "dotenv/config"
import LookUpEnumsValidation from "../helpers/validate-lookup"




async function initializeNewLookUp() {


    // await LookUpEnumsValidation.initalizeNewLookup('tblPermission')

    await LookUpEnumsValidation.validate()


    process.exit(0)
}

initializeNewLookUp()