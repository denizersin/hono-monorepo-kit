import LookUpEnumsValidation from "../helpers/validate-lookup"




async function initializeNewLookUp() {



    // await LookUpEnumsValidation.initializeLanguageToDb()

    // await LookUpEnumsValidation.initializeLogStatusToDb()

    await LookUpEnumsValidation.validate()


    process.exit(0)
}

initializeNewLookUp()