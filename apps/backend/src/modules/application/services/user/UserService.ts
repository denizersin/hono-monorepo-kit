import { TUserValidator } from "@repo/shared/userInsertSchema";
import { getApiContext } from "@server/lib/hono/utils";
import { IUserRepository } from "@server/modules/domain/repositories/IUserRepository";
import { EventBus } from "../../event";
import { ENUM_USER_EVENTS } from "../../event/interface/user";

export class UserService {
    constructor(private readonly userRepository: IUserRepository) { }

    async createUser(userData: TUserValidator.TblUserInsert): Promise<number> {
        const ctx = getApiContext();


        const result = await this.userRepository.createUser(userData)

        const session = ctx.session;

        EventBus.emit(ENUM_USER_EVENTS.USER_CREATED, {
            ctx,
            type: ENUM_USER_EVENTS.USER_CREATED,
            logData: {
                type: ENUM_USER_EVENTS.USER_CREATED,
                occurredAt: new Date(),
                creatorName: session?.user.fullName || 'System',
                newString: `${userData.fullName} - id:${result}`,
                previousString: '',
                userField: 'asd',
                description:'User created'
            },
            userField: 'asd',
            withDefaultLog: true,
        })

        return result;
    }




}

