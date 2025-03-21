import { SahredEnums } from "@repo/shared/enums";
import { TRole, TSession } from "@repo/shared/types";
import { TAuthValidator } from "@repo/shared/validators";
import { AuthenticationError, ConflictError } from "@server/lib/errors";
import { IUserRepository } from "@server/modules/domain/repositories/IUserRepository";
import { JwtService } from "../jwtService";

export class AuthService {
    
    constructor(private readonly userRepository: IUserRepository) { }

    async login(userData: TAuthValidator.TLoginEmailAndPasswordFormSchema) {
        
        const user = await this.userRepository.getUserByEmailAndPassword(userData.email, userData.password)
        if (!user) {
            throw new AuthenticationError("Invalid email or password")
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

    async register(userData: TAuthValidator.TRegisterFormSchema) {
        const existingUser = await this.userRepository.getUserByEmail(userData.email)
        if (existingUser) {
            throw new ConflictError("User with this email already exists")
        }

        const userId = await this.userRepository.createUser({
            ...userData,
            companyId: 1,
            role: SahredEnums.Role.USER,
        })
        if (!userId) {
            throw new Error("Failed to create user")
        }

        return {
            userId
        }
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
            throw new AuthenticationError("Invalid token")
        }
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