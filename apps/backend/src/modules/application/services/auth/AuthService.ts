import { SahredEnums } from "@repo/shared/enums";
import { TJWTSession, TRole, TSession } from "@repo/shared/types";
import { TAuthValidator } from "@repo/shared/validators";
import { APP_CONSTANTS } from "@server/lib/constants";
import { BadRequestError, ConflictError, CustomError, UnauthorizedError } from "@server/lib/errors";
import { tryCatch } from "@server/lib/utils";
import { generateAlphanumericCode } from "@server/lib/uuid-code";
import { IUserRepository } from "@server/modules/domain/repositories/IUserRepository";
import { IVerifyCodeRepository } from "@server/modules/domain/repositories/IVerifyCodeRepository";
import { CountryRepository } from "@server/modules/infrastructure/repositories/data/CountryRepository";
import { EventBus } from "../../event";
import { ENUM_ALL_EVENTS } from "../../event/interface";
import { ENUM_USER_EVENTS } from "../../event/interface/user";
import { JwtService } from "../jwtService";
import { WhatsappService } from "../whatsapp";

export class AuthService {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly wpClientService: WhatsappService,
        private readonly countryRepository: CountryRepository,
        private readonly verifyCodeRepository: IVerifyCodeRepository,
    ) { }

    async login(userData: TAuthValidator.TLoginEmailAndPasswordFormSchema) {

        const user = await this.userRepository.getUserByEmailAndPassword(userData.email, userData.password)
        if (!user) {
            throw new UnauthorizedError({ message: 'Invalid email or password', toast: true })
        }

        console.log(user, 'user2')
        const sessionUser = await this.userRepository.getSessionUser(user)

        const session: TSession = {
            companyId: user.companyId,
            role: user.role as TRole,
            user: sessionUser
        }

        const jwtSession: TJWTSession = {
            role: user.role as TRole,
            companyId: user.companyId,
            userId: user.id,
            email: user.email,
            fullName: user.fullName
        }
        const token = this.generateToken(jwtSession)


        return {
            session: session as TSession,
            token
        }
    }



    async register(userData: TAuthValidator.TRegisterFormSchema, isPhoneVerified: boolean): Promise<{
        session: TSession,
        token: string
    }> {

        const existingUser = await this.userRepository.getUserByEmail(userData.email)
        if (existingUser) {
            throw new ConflictError({ message: 'User with this email already exists', toast: true })
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
            isPhoneVerified: isPhoneVerified,
            phoneVerificationCodeSendAt: new Date(),

        })


        EventBus.emit(ENUM_USER_EVENTS.USER_REGISTERED, {
            type: ENUM_USER_EVENTS.USER_REGISTERED,
            logData: {
                type: ENUM_ALL_EVENTS.USER_REGISTERED,
                occurredAt: new Date(),
                creatorName: 'System',
                newString: `${userData.name} ${userData.surname} - id:${userId}`,
                description: 'User registered',
            }
        })

        if (!userId) {
            throw new CustomError({ message: 'Failed to create user' })
        }


        const user = await this.userRepository.getUserById(userId)
        if (!user) {
            throw new CustomError({ message: 'User not found' })
        }

        const sessionUser = await this.userRepository.getSessionUser(user)

        const session: TSession = {
            companyId: user.companyId,
            role: user.role as TRole,
            user: sessionUser
        }

        const jwtSession: TJWTSession = {
            role: user.role as TRole,
            companyId: user.companyId,
            userId: user.id,
            email: user.email,
            fullName: user.fullName
        }

        return {
            session,
            token: this.generateToken(jwtSession)
        }
    }

    async registerWithOtp(userData: TAuthValidator.TRegisterFormSchema): Promise<boolean> {

        const existingUser = await this.userRepository.getUserByEmail(userData.email)
        if (existingUser) {
            throw new ConflictError({ message: 'User with this email already exists', toast: true })
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

        console.log(fullPhone, 'fullPhone1')

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
        console.log(fullPhone, 'fullPhone2', verifyCode)
        if (!verifyCode) {
            throw new UnauthorizedError({ message: 'code not found' })
        }
        console.log(verifyCode, 'verifyCode')
        if (verifyCode.generatedForPhoneOrMail !== fullPhone && verifyCode.generatedForPhoneOrMail !== code.registerForm.email) {
            throw new UnauthorizedError({ message: 'Invalid code', toast: true })
        }
        if (verifyCode.expiresAt < new Date()) {
            throw new UnauthorizedError({ message: 'Code expired', toast: true })
        }
        if (!verifyCode.isMobile) {
            throw new UnauthorizedError({ message: 'Code is not mobile', toast: true })
        }
        if (verifyCode.code !== code.code) {
            throw new UnauthorizedError({ message: 'Invalid code', toast: true })
        }
        // await this.register
        await this.verifyCodeRepository.deleteVerifyCode(verifyCode.id)

        const result = this.register(code.registerForm, true)
        return result
    }

    generatePhoneVerificationCode: () => number = () => {
        return Math.floor(100000 + Math.random() * 900000)
    }

    generateToken(session: TJWTSession) {
        return JwtService.signToken(session)
    }

    /**
     * verifyToken: JWT token'ı doğrular ve geçerliyse payload'ı döndürür.
     * Eğer token geçersizse veya süresi dolmuşsa hata fırlatır.
     */
    verifyToken(token: string) {
        try {
            const payload = JwtService.verifyToken(token) as TJWTSession
            return payload
        } catch (error) {
            throw new UnauthorizedError({ message: 'Invalid token' })
        }
    }

    async resendVerificationCode(registerForm: TAuthValidator.TRegisterFormSchema) {
        console.log(registerForm, 'registerForm')
        const canResend = await this.canResendVerificationCode(registerForm)
        if (!canResend) {
            throw new BadRequestError({ message: 'you can only resend the code after 1 minute' ,toast: true})
        }
        await this.sendVerificationCode(registerForm)
        return true
    }

    async canResendVerificationCode(registerForm: TAuthValidator.TRegisterFormSchema) {
        const fullPhone = await this.getFullPhoneWithoutPlus(registerForm.phoneCodeId, registerForm.phoneNumber)

        const verifyCode = await this.verifyCodeRepository.getVerifyCodeByPhoneOrMail(fullPhone)
        console.log(verifyCode, 'verifyCode')
        console.log(new Date(), 'new Date()')
        if (verifyCode && verifyCode.expiresAt > new Date()) {
            console.log(new Date(), 'new Date()')
            console.log(verifyCode.expiresAt, 'verifyCode.expiresAt')
            return false
        }
        return true
    }


    async sendVerificationCode(registerForm: TAuthValidator.TRegisterFormSchema) {
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
        console.log(phoneCodeId, country)
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