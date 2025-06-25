import db from "@server/modules/infrastructure/database"
import { SahredEnums } from "@repo/shared/enums"
import { CustomError } from "@server/lib/errors"
import { tblChatType, tblLanguage, tblMailConfirmationStatus } from "@repo/shared/schema"



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
        console.log('LookUpEnumsValidation validation started')

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
                throw new CustomError({ message: `Mail confirmation status ${status.name} is not valid` })
            }

        })

        LookUpEnumsValidation.validationPromise = Promise.resolve()

        console.log('LookUpEnumsValidation validation completed successfully')

        //role
    }


    //initialize mail confirmation status to db
    static async initializeMailConfirmationStatusToDb() {
        await db.insert(tblMailConfirmationStatus).values(
            Object.values(SahredEnums.MailConfirmationStatus).map(status => ({
                name: status,
                id: SahredEnums.MailConfirmationStatusId[status]
            }))
        )
    }

    //initialize chat type to db
    static async initializeChatTypeToDb() {
        await db.insert(tblChatType).values(
            Object.values(SahredEnums.ChatType).map((type) => ({
                name: type,
                id: SahredEnums.ChatTypeId[type]
            }))
        )
    }

    //initialize language to db
    static async initializeLanguageToDb() {

        await db.insert(tblLanguage).values(
            Object.values(SahredEnums.Language).map((language) => ({
                name: language,
                code: language,
                id: SahredEnums.LanguageId[language]
            }))
        )

    }


    static async initializeLookUpToDb() {

        //initialize
        await LookUpEnumsValidation.initializeMailConfirmationStatusToDb()

        //initialize chat type
        await LookUpEnumsValidation.initializeChatTypeToDb()

    }

}

export default LookUpEnumsValidation