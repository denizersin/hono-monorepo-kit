import { SahredEnums } from "@repo/shared/enums"
import { CompanyRepositoryImpl } from "../../repositories/company/CompanyRepositoryImpl"
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


    //insert super admin user
    console.log("initializeSuperAdminUser")
    const userRepository = new UserRepositoryImpl()
    const superAdminUserId = await userRepository.createUser({
        email: "superadmin@gmail.com",
        password: "superadmin123",
        role: SahredEnums.Role.SUPER_ADMIN,
        name: "Super Admin",
        surname: "Super Admin",
        fullName: "Super Admin Super Admin",
        companyId: SahredEnums.CompanyId.default,
        mailConfirmationStatusId: SahredEnums.MailConfirmationStatusId.confirmed,
        test: "test",
        phoneCodeId: 1,
        phoneNumber: "1234567890",
        invitationCode: "1234567890",
        fullPhone: "1234567890",
        isPhoneVerified: true,
    })


    //insert admin user
    console.log("initializeAdminUser")
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


    //insert company
    console.log("initializeCompany")
    const companyRepository = new CompanyRepositoryImpl()
    const companyId = await companyRepository.createCompany({
        name: "Default Company",
    })
    console.log("initializeCompany completed")



    //insert company language
    console.log("initializeCompanyLanguage")
    companyRepository.updateCompanyLanguages({
        companyId,
        languages: [SahredEnums.LanguageId.en, SahredEnums.LanguageId.tr],
    })
    console.log("initializeCompanyLanguage completed")


    //insert owner user

    console.log("initializeOwnerUser")
    await userRepository.createUser({
        email: "owner@gmail.com",
        password: "owner123",
        role: SahredEnums.Role.OWNER,
        name: "Owner",
        surname: "Owner",
        fullName: "Owner Owner",
        companyId,
        phoneCodeId: 1,
        phoneNumber: "1234567890",
        invitationCode: "1234567890",
        fullPhone: "1234567890",
        isPhoneVerified: true,
        mailConfirmationStatusId: SahredEnums.MailConfirmationStatusId.confirmed,
        test: "test",
    })
    console.log("initializeOwnerUser completed")



    process.exit(0)
}

initializeDb()