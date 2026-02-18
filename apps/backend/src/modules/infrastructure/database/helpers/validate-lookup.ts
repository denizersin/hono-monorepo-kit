import db, { TDbTable, TDbTableName } from "@server/modules/infrastructure/database"
import { CustomError } from "@server/lib/errors"
import { tblLanguage, tblMailConfirmationStatus, tblLogStatus, tblRole, tblPermission } from "@repo/shared/schema"
import { ENUM_ALL_EVENT_IDS, ENUM_ALL_EVENTS } from "@server/modules/application/event/interface"
import logger from "@server/lib/logger"
import { SahredEnums } from "@repo/shared/enums"



//lookups with only id and name (LookupEnum string) like tblStatus={id:1,name:'active'}
const LookUpRecords: Record<string | TDbTableName, {
    LookupEnum: Record<string, number>,
    dbTable: TDbTable,
    dbName: TDbTableName,
}> = {
    tblMailConfirmationStatus: {
        LookupEnum: SahredEnums.MailConfirmationStatus,
        dbTable: tblMailConfirmationStatus,
        dbName: 'tblMailConfirmationStatus',
    },
    tblLogStatus: {
        LookupEnum: ENUM_ALL_EVENT_IDS,
        dbTable: tblLogStatus,
        dbName: 'tblLogStatus',
    },
    tblRole: {
        LookupEnum: SahredEnums.Role,
        dbTable: tblRole,
        dbName: 'tblRole',
    },
    tblPermission: {
        LookupEnum: SahredEnums.Permission,
        dbTable: tblPermission,
        dbName: 'tblPermission',
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
            Object.entries(SahredEnums.Language).map(([language, id]) => ({
                name: language,
                code: language,
                id: id
            }))
        )

    }




    static async initializeAllLookUp(table?: TDbTableName) {
        for (const record of Object.values(LookUpRecords)) {

            const { LookupEnum: enumString, dbTable } = record;

            //if table is not provided, then insert all records
            if (table && record.dbName !== table) continue



            //@ts-ignore
            await db.insert(dbTable).values(
                Object.entries(enumString).map(([name, id]) => ({ name, id }))
            )
        }
    }
    static async initalizeNewLookup(table: TDbTableName) {
        console.log(table, 'table')
        const record = LookUpRecords[table]
        if (!record) {
            throw new CustomError({ message: `Record ${table} is not valid` })
        }
        const { LookupEnum: enumString, dbTable } = record
        //@ts-ignore
        await db.insert(dbTable).values(
            Object.entries(enumString).map(([name, id]) => ({ name, id }))
        )
    }

    static async validateAllLookUp() {


        for (const record of Object.values(LookUpRecords)) {
            const { LookupEnum: enumString, dbName, dbTable } = record
            //@ts-ignore
            const records = await db.query[dbName].findMany()

            if (records.length < Object.values(enumString).length) {
                // throw new CustomError({ message: `Record ${dbName} is not valid` })
                console.warn(`detected missing records in ${dbName} adding if not exists`)
                const promises = Object.entries(enumString).map(async ([name, id]) => {
                    const record = records.find((record: { name: string, id: number }) => record.name === name)
                    if (!record) {
                        //@ts-ignore 
                        await db.insert(dbTable).values({ name, id })
                        console.log(enumString, 'was not found in db. so adding it')
                        logger.db('detected missing records in tblMailConfirmationStatus adding if not exists', { name, id })
                    }
                })

                await Promise.all(promises)

            }




            records.forEach((record: { name: string, id: number }) => {
                const recordName = record.name
                const enumRecordName = Object.entries(enumString).find(([name, id]) => id === record.id)
                if (!enumRecordName) {
                    throw new CustomError({ message: `Record ${record.name} is not valid` })
                }
                const enumRecordId = enumString[enumRecordName[0] as keyof typeof enumString]
                if (
                    enumRecordName[0] !== recordName ||
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