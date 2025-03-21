import { UserService } from "@server/modules/application/services/user/UserService";
import { TUserValidator } from "@repo/shared/userInsertSchema";

export class CreateUserUseCase {
    constructor(private readonly userService: UserService) {}
    
    async execute(userData: TUserValidator.TUserCreateSchema): Promise<number> {
        return this.userService.createUser(userData)
    }
}