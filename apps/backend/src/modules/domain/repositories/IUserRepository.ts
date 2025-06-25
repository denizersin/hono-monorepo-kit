import { TSession } from "@repo/shared/types";
import TUserEntity from "../entities/user/User";

export interface IUserRepository {
    getUserById(id: number): Promise<TUserEntity.TUser|undefined>
    getUserByIdStrict(id: number): Promise<TUserEntity.TUser>
    getUserByEmail(email: string): Promise<TUserEntity.TUser|undefined>
    createUser(user: TUserEntity.TUserInsert): Promise<number>
    getUserByEmailAndPassword(email: string, password: string): Promise<TUserEntity.TUser|undefined>
    getSessionUser(user:TUserEntity.TUser): Promise<TSession['user']>
    updateUser({
        id,
        data
    }: {
        id: number,
        data: Partial<TUserEntity.TUser>
    }): Promise<void>
}

