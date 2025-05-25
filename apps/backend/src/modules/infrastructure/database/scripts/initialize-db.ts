import db from "@server/modules/infrastructure/database"
import { schema } from "@server/modules/infrastructure/database/schema"
import { SahredEnums } from "@repo/shared/enums"
import { ENV } from "@server/env"
import { AuthService } from "@server/modules/application/services/auth/Auth"
import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl"
import { UserService } from "@server/modules/application/services/user/UserService"
import LookUpEnumsValidation from "../helpers/validate-lookup"
import { InitializeDbData } from "../helpers/init-data"




async function initializeDb() {
    console.log("initialize db data")
    await InitializeDbData.initializeDbData()
    console.log("initialize db data completed")



    //insert lookup enums
    console.log("initializeLookUpToDb")
    await LookUpEnumsValidation.initializeLookUpToDb()
    console.log("initializeLookUpToDb completed")

    //insert admin user
    console.log("initializeAdminUser")
    const userService = new UserService(new UserRepositoryImpl())
    await userService.createUser({
        email: "admin@admin.com",
        password: "admin",
        role: "admin",
        name: "Admin",
        surname: "Admin",
        fullName: "Admin Admin",
        companyId: SahredEnums.CompanyId.default,
        mailConfirmationStatusId: SahredEnums.MailConfirmationStatusId.confirmed,
        test: "test",
        phoneCodeId: 1,
        phoneNumber: "1234567890",
        invitationCode: "1234567890",
        fullPhone: "1234567890",
        isPhoneVerified: true,
    })
    console.log("initializeAdminUser completed")


    process.exit(0)
}

initializeDb()