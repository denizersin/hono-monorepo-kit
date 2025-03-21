import { IUserRepository } from "@server/modules/domain/repositories/IUserRepository";
import { SahredEnums } from "@repo/shared/enums";
import { TUserValidator } from "@repo/shared/userInsertSchema";

export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async createUser(userData: TUserValidator.TUserCreateSchema): Promise<number> {
        return this.userRepository.createUser({
            ...userData,
            role: SahredEnums.Role.USER,
        })
    }

    async createUserAdmin(userData: TUserValidator.TAdminCreateUserSchema){
        return this.userRepository.createUser(userData)
    }
}

