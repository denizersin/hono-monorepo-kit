import { SahredEnums } from "@repo/shared/enums";
import { UserService } from "@server/modules/application/services/user/UserService";
import { TUserValidator } from "@repo/shared/userInsertSchema";

export class CreateUserUseCase {
    constructor(private readonly userService: UserService) { }

    async executeAsAdmin(userData: TUserValidator.TAdminCreateUserSchema) {
                
        return this.userService.createUser(userData)
    }

    async executeAsUser(userData: TUserValidator.TUserCreateSchema) {

        return this.userService.createUser({
            ...userData,
            role: SahredEnums.Role.USER
        })
    }

}