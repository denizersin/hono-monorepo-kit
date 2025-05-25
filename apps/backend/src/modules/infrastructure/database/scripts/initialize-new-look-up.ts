import LookUpEnumsValidation from "../helpers/validate-lookup"




async function initializeNewLookUp() {



    await LookUpEnumsValidation.initializeChatTypeToDb()

    await LookUpEnumsValidation.validate()


    process.exit(0)
}

initializeNewLookUp()