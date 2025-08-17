import db, { TDbTable, TDbTableName } from "@server/modules/infrastructure/database"
import { SahredEnums } from "@repo/shared/enums"
import { CustomError } from "@server/lib/errors"
import { tblLanguage, tblMailConfirmationStatus, tblLogStatus } from "@repo/shared/schema"
import { ENUM_ALL_EVENT_IDS, ENUM_ALL_EVENTS } from "@server/modules/application/event/interface"
import logger from "@server/lib/logger"



//lookups with only id and name (enum string) like tblStatus={id:1,name:'active'}
const LookUpRecords: Record<string, {
    enumString: Record<string, string>,
    enumId: Record<string, number>,
    dbTable: TDbTable,
    dbName: TDbTableName,
}> = {
    mailConfirmationStatus: {
        enumString: SahredEnums.MailConfirmationStatus,
        enumId: SahredEnums.MailConfirmationStatusId,
        dbTable: tblMailConfirmationStatus,
        dbName: 'tblMailConfirmationStatus',
    },
    logStatus: {
        enumString: ENUM_ALL_EVENTS,
        enumId: ENUM_ALL_EVENT_IDS,
        dbTable: tblLogStatus,
        dbName: 'tblLogStatus',
    },

}


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




    static async initializeAllLookUp(table?: TDbTableName) {
        for (const record of Object.values(LookUpRecords)) {
            const { enumString, enumId, dbTable } = record
            if (table && record.dbName !== table) continue
            console.log(table,'table')
            console.log(record.dbName,'record.dbName')
            console.log(Object.values(enumString).map(name => ({ name, id: enumId[name as keyof typeof enumId] })))

            //@ts-ignore
            await db.insert(dbTable).values(
                Object.values(enumString).map(name => ({ name, id: enumId[name as keyof typeof enumId] }))
            )
        }
    }

    static async validateAllLookUp() {

        for (const record of Object.values(LookUpRecords)) {
            const { enumString, enumId, dbName, dbTable } = record
            //@ts-ignore
            const records = await db.query[dbName].findMany()

            if (records.length < Object.values(enumString).length) {
                // throw new CustomError({ message: `Record ${dbName} is not valid` })
                console.warn(`detected missing records in ${dbName} adding if not exists`)
                const promises = Object.values(enumString).map(async (name) => {
                    const record = records.find((record: { name: string, id: number }) => record.name === name)
                    if (!record) {
                        //@ts-ignore
                        await db.insert(dbTable).values({ name, id: enumId[name as keyof typeof enumId] })
                        console.log(enumString, 'was not found in db. so adding it')
                        logger.db('detected missing records in tblMailConfirmationStatus adding if not exists', { name, id: enumId[name as keyof typeof enumId] })
                    }
                })

                await Promise.all(promises)

            }




            records.forEach((record: { name: string, id: number }) => {
                const recordName = record.name
                const enumRecordName = enumString[recordName as keyof typeof enumString]
                const enumRecordId = enumId[enumRecordName as keyof typeof enumId]

                if (
                    enumRecordName !== recordName ||
                    enumRecordId !== record.id
                ) {
                    throw new CustomError({ message: `Record ${record.name} is not valid` })
                }
            })
        }
    }


    static async initializeLookUpToDb() {

        //initialize
        await LookUpEnumsValidation.initializeAllLookUp()

        //initialize chat type
        // await LookUpEnumsValidation.initializeChatTypeToDb()

    }


    static async validate() {
        console.log('LookUpEnumsValidation validation started')

        await LookUpEnumsValidation.validateAllLookUp()

        LookUpEnumsValidation.validationPromise = Promise.resolve()

        console.log('LookUpEnumsValidation validation completed successfully')

        //role
    }


    static async initializeNewLookUpToDb(table: TDbTableName) {
        await LookUpEnumsValidation.initializeAllLookUp(table)
    }


}

export default LookUpEnumsValidation