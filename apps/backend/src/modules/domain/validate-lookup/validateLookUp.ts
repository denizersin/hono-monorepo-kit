import db from "@server/modules/infrastructure/database"
import { schema } from "@server/modules/infrastructure/database/schema"
import { SahredEnums } from "@repo/shared/enums"



export class LookUpEnumsValidation {


    static instance: LookUpEnumsValidation

    static validationPromise: Promise<void>

    private constructor() {
    }

    static getInstance() {
        if (!LookUpEnumsValidation.instance) {
            LookUpEnumsValidation.instance = new LookUpEnumsValidation()
        }
        return LookUpEnumsValidation.instance
    }
    static async validate() {

        //mail confirmation status
        const mailConfirmationStatus = await db.query.tblMailConfirmationStatus.findMany()
        mailConfirmationStatus.forEach(status => {
            const statusName = status.name
            const enumStatusName = SahredEnums.MailConfirmationStatus[statusName]
            const enumStatusId = SahredEnums.MailConfirmationStatusId[statusName]

            if (
                enumStatusName !== statusName ||
                enumStatusId !== status.id
            ) {
                throw new Error(`Mail confirmation status ${status.name} is not valid`)
            }

        })

        LookUpEnumsValidation.validationPromise = Promise.resolve()

        console.log('LookUpEnumsValidation validation completed')

        //role
    }

    static async initializeLookUpToDb() {

        //initialize
        await db.insert(schema.tblMailConfirmationStatus).values(
            Object.values(SahredEnums.MailConfirmationStatus).map(status => ({
                name: status,
                id: SahredEnums.MailConfirmationStatusId[status]
            }))
        )

    }
}

export default LookUpEnumsValidation