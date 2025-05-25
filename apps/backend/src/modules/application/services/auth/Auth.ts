import { SahredEnums } from "@repo/shared/enums";
import { TRole, TSession } from "@repo/shared/types";
import { TAuthValidator } from "@repo/shared/validators";
import { APP_CONSTANTS } from "@server/lib/constants";
import { AuthenticationError, ConflictError, CustomError } from "@server/lib/errors";
import { tryCatch } from "@server/lib/utils";
import { generateAlphanumericCode } from "@server/lib/uuid-code";
import { IUserRepository } from "@server/modules/domain/repositories/IUserRepository";
import { IVerifyCodeRepository } from "@server/modules/domain/repositories/IVerifyCodeRepository";
import { CountryRepository } from "@server/modules/infrastructure/repositories/data/CountryRepository";
import { JwtService } from "../jwtService";
import { WhatsappService } from "../whatsapp";

export class AuthService {

    constructor(private readonly userRepository: IUserRepository,
        private readonly wpClientService: WhatsappService,
        private readonly countryRepository: CountryRepository,
        private readonly verifyCodeRepository: IVerifyCodeRepository
    ) { }

    async login(userData: TAuthValidator.TLoginEmailAndPasswordFormSchema) {

        const user = await this.userRepository.getUserByEmailAndPassword(userData.email, userData.password)
        if (!user) {
            throw new AuthenticationError({ message: 'Invalid email or password', toast: true })
        }

        const userWithoutPassword = await this.userRepository.getSessionUser(user)

        const session: TSession = {
            companyId: user.companyId,
            role: user.role as TRole,
            user: userWithoutPassword
        }

        const token = this.generateToken(session)

        return {
            session: session as TSession,
            token
        }
    }



    async register(userData: TAuthValidator.TRegisterFormSchema): Promise<{
        session: TSession,
        token: string
    }> {

        const existingUser = await this.userRepository.getUserByEmail(userData.email)
        if (existingUser) {
            throw new ConflictError({ message: 'User with this email already exists' })
        }
        const country = await this.countryRepository.getCountryById(userData.phoneCodeId)
        const fullPhone = `${country.phoneCode}${userData.phoneNumber}`


        const userId = await this.userRepository.createUser({
            ...userData,
            companyId: SahredEnums.CompanyId.default,
            role: SahredEnums.Role.USER,
            fullName: `${userData.name} ${userData.surname}`,
            mailConfirmationStatusId: SahredEnums.MailConfirmationStatusId.pending,
            test: '',
            fullPhone: fullPhone,
            invitationCode: generateAlphanumericCode(6),
            isPhoneVerified: false,
            phoneVerificationCodeSendAt: new Date(),

        })
        if (!userId) {
            throw new CustomError({ message: 'Failed to create user' })
        }


        const user = await this.userRepository.getUserById(userId)
        if (!user) {
            throw new CustomError({ message: 'User not found' })
        }

        const session: TSession = {
            companyId: user.companyId,
            role: user.role as TRole,
            user: user
        }

        return {
            session,
            token: this.generateToken(session)
        }
    }

    async registerWithOtp(userData: TAuthValidator.TRegisterFormSchema): Promise<boolean> {

        const existingUser = await this.userRepository.getUserByEmail(userData.email)
        if (existingUser) {
            throw new ConflictError({ message: 'User with this email already exists' })
        }
        const fullPhone = await this.getFullPhoneWithoutPlus(userData.phoneCodeId, userData.phoneNumber)
        const existingVerifyCode = await this.verifyCodeRepository.getVerifyCodeByPhoneOrMail(fullPhone)
        
        if (existingVerifyCode) {
            await this.verifyCodeRepository.deleteVerifyCodeByPhoneOrMail(fullPhone)
        }

        const verificationCode = this.generatePhoneVerificationCode()

        const { error, data: sendMessageResult } = await tryCatch(this.wpClientService.sendMessage({
            message: `Verification code: ${verificationCode}`,
            id: `${fullPhone}@c.us`
        }))

        console.log(sendMessageResult, 'result')

        console.log(fullPhone,'fullPhone1')

        if (error) {
            console.log(error)
            throw new CustomError({ message: 'Failed to send verification code' })
        }


        await this.verifyCodeRepository.createVerifyCode({
            code: verificationCode,
            expiresAt: new Date(Date.now() + APP_CONSTANTS.PHONE_VERIFICATION_CODE_EXPIRATION_TIME),
            isMobile: true,
            generatedForPhoneOrMail: fullPhone,
            isMail: false,
            createdAt: new Date()
        })

        return true
    }


    sendWhatsappVerificationCode: ({
        phoneId
    }: {
        phoneId: string,
        message: string
    }) => Promise<void> = async ({ phoneId, message }) => {
        await this.wpClientService.sendMessage({
            message: message,
            id: phoneId
        })
    }

    async verifyCode(code: TAuthValidator.TVerifyCodeFormSchema) {

        const fullPhone = await this.getFullPhoneWithoutPlus(code.registerForm.phoneCodeId, code.registerForm.phoneNumber)
        const verifyCode = await this.verifyCodeRepository.getVerifyCodeByPhoneOrMail(fullPhone)
        console.log(fullPhone,'fullPhone2',verifyCode)
        if (!verifyCode) {
            throw new AuthenticationError({ message: 'code not found' })
        }
        console.log(verifyCode,'verifyCode')
        if (verifyCode.generatedForPhoneOrMail !== fullPhone && verifyCode.generatedForPhoneOrMail !== code.registerForm.email) {
            throw new AuthenticationError({ message: 'Invalid code' ,toast:true})
        }
        if (verifyCode.expiresAt < new Date()) {
            throw new AuthenticationError({ message: 'Code expired' ,toast:true})
        }
        if (!verifyCode.isMobile) {
            throw new AuthenticationError({ message: 'Code is not mobile' ,toast:true})
        }
        if (verifyCode.code !== code.code) {
            throw new AuthenticationError({ message: 'Invalid code' ,toast:true})
        }
        // await this.register
        await this.verifyCodeRepository.deleteVerifyCode(verifyCode.id)

        const result = this.register(code.registerForm)
        return result
    }

    generatePhoneVerificationCode: () => number = () => {
        return Math.floor(100000 + Math.random() * 900000)
    }

    generateToken(session: TSession) {
        return JwtService.signToken(session)
    }

    /**
     * verifyToken: JWT token'ı doğrular ve geçerliyse payload'ı döndürür.
     * Eğer token geçersizse veya süresi dolmuşsa hata fırlatır.
     */
    verifyToken(token: string) {
        try {
            const payload = JwtService.verifyToken(token) as TSession
            return payload
        } catch (error) {
            throw new AuthenticationError({ message: 'Invalid token' })
        }
    }

    async resendVerificationCode(registerForm: TAuthValidator.TRegisterFormSchema) {
        const fullPhone = await this.getFullPhoneWithoutPlus(registerForm.phoneCodeId, registerForm.phoneNumber)
        await this.verifyCodeRepository.deleteVerifyCodeByPhoneOrMail(fullPhone)
        const verificationCode = this.generatePhoneVerificationCode()

        const { error, data: sendMessageResult } = await tryCatch(this.wpClientService.sendMessage({
            message: `Verification code: ${verificationCode}`,
            id: `${fullPhone}@c.us`
        }))
        if (error) {
            throw new CustomError({ message: 'Failed to send verification code' })
        }

        await this.verifyCodeRepository.createVerifyCode({
            code: verificationCode,
            expiresAt: new Date(Date.now() + APP_CONSTANTS.PHONE_VERIFICATION_CODE_EXPIRATION_TIME),
            isMobile: true,
            generatedForPhoneOrMail: fullPhone,
            isMail: false,
            createdAt: new Date()
        })

        return true
    }

    async getFullPhoneWithoutPlus(phoneCodeId: number, phoneNumber: string) {
        const country = await this.countryRepository.getCountryById(phoneCodeId)
        const phone = `${country.phoneCode}${phoneNumber}`
        return phone.replace('+', '')
    }

    /**
     * decodeToken: JWT token'ı decode eder ve payload'ı döndürür.
     * Token'ın geçerli olup olmadığını kontrol etmez, sadece içeriğini okur.
     * Token geçersiz olsa bile hata fırlatmaz.
     */
    static decodeToken(token: string) {
        return JwtService.decodeToken(token) as TSession
    }
}