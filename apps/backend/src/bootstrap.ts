import { AuthService } from "./modules/application/services/auth/Auth";
import { WhatsappService } from "./modules/application/services/whatsapp";
import { CountryRepository } from "./modules/infrastructure/repositories/data/CountryRepository";
import { VerifyCodeRepositoryImpl } from "./modules/infrastructure/repositories/verifyCode/VerifyCodeRepositoryImpl";
import { UserRepositoryImpl } from "./modules/infrastructure/repositories/user/UserRepositoryImpl";
import { UserService } from "./modules/application/services/user/UserService";
import { LanguageRepository } from "./modules/infrastructure/repositories/data/LanguageRepository";

export const userRepository = new UserRepositoryImpl()
export const wpClientService = new WhatsappService()
export const countryRepository = new CountryRepository()
export const verifyCodeRepository = new VerifyCodeRepositoryImpl()
export const languageRepository = new LanguageRepository()





export const authService = new AuthService(userRepository, wpClientService, countryRepository, verifyCodeRepository)
export const userService = new UserService(userRepository)