import { TUserValidator } from "@repo/shared/userInsertSchema";
import { IUserRepository } from "@server/modules/domain/repositories/IUserRepository";

export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async createUser(userData: TUserValidator.TblUserInsert): Promise<number> {
        return this.userRepository.createUser(userData)
    }

    
    

}

