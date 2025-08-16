import { SahredEnums } from "@repo/shared/enums"
import { UserService } from "@server/modules/application/services/user/UserService"
import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl"
import { InitializeDbPrededfinedDatas } from "../helpers/init-data"
import LookUpEnumsValidation from "../helpers/validate-lookup"




async function initializeDb() {
    console.log("initialize db prededfined data")
    await InitializeDbPrededfinedDatas.initializeDbPrededfinedDatas()
    console.log("initialize db prededfined data completed")



    //insert lookup enums
    console.log("initializeLookUpToDb")
    await LookUpEnumsValidation.initializeLookUpToDb()
    console.log("initializeLookUpToDb completed")

    //insert admin user
    console.log("initializeAdminUser")
    const userRepository = new UserRepositoryImpl()
    await userRepository.createUser({
        email: "admin@gmail.com",
        password: "admin123",
        role: SahredEnums.Role.ADMIN,
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
    console.log("initialize AdminUser completed")


    process.exit(0)
}

initializeDb()