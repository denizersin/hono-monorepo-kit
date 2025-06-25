import { IUserRepository } from "@server/modules/domain/repositories/IUserRepository";
import TUserEntity from "@server/modules/domain/entities/user/User";
import db from "../../database";
import { and, eq } from "drizzle-orm";
import {  tblUser } from "@repo/shared/schema";
import { TSession } from "@repo/shared/types";


export class UserRepositoryImpl implements IUserRepository {

    async getUserById(id: number): Promise<TUserEntity.TUser|undefined> {
        const user = await db.query.tblUser.findFirst({
            where: eq(tblUser.id, id)
        })
        return user;
    }

    async getUserByEmail(email: string): Promise<TUserEntity.TUser|undefined> {
        const user = await db.query.tblUser.findFirst({
            where: eq(tblUser.email, email)
        })
        return user;
    }

    async createUser(user: TUserEntity.TUserInsert): Promise<number> {
        const [newUser] = await db.insert(tblUser).values(user).$returningId()
        if(!newUser) {
            throw new Error("User not created")
        }
        return newUser.id
    }

    async getUserByEmailAndPassword(email: string, password: string): Promise<TUserEntity.TUser|undefined> {
        const user = await db.query.tblUser.findFirst({
            where: and(eq(tblUser.email, email), eq(tblUser.password, password))
        })
        return user;
    }

    async getSessionUser(user:TUserEntity.TUser): Promise<TSession['user']> {
        const {password, ...userWithoutPassword} = user
        return userWithoutPassword
    }
    async updateUser({id, data}: {id: number, data: Partial<TUserEntity.TUser>}): Promise<void> {
        await db.update(tblUser).set(data).where(eq(tblUser.id, id))
    }
}
