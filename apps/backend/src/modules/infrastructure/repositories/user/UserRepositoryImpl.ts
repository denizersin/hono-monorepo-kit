import { IUserRepository } from "@server/modules/domain/repositories/IUserRepository";
import TUserEntity from "@server/modules/domain/entities/user/User";
import db from "../../database";
import { and, eq } from "drizzle-orm";
import schema from "../../database/schema";
import { TSession } from "@repo/shared/types";


export class UserRepositoryImpl implements IUserRepository {

    async getUserById(id: number): Promise<TUserEntity.TUser|undefined> {
        const user = await db.query.tblUser.findFirst({
            where: eq(schema.tblUser.id, id)
        })
        return user;
    }

    async getUserByEmail(email: string): Promise<TUserEntity.TUser|undefined> {
        const user = await db.query.tblUser.findFirst({
            where: eq(schema.tblUser.email, email)
        })
        return user;
    }

    async createUser(user: TUserEntity.TUserInsert): Promise<number> {
        const [newUser] = await db.insert(schema.tblUser).values(user).$returningId()
        if(!newUser) {
            throw new Error("User not created")
        }
        return newUser.id
    }

    async getUserByEmailAndPassword(email: string, password: string): Promise<TUserEntity.TUser|undefined> {
        const user = await db.query.tblUser.findFirst({
            where: and(eq(schema.tblUser.email, email), eq(schema.tblUser.password, password))
        })
        return user;
    }

    async getSessionUser(user:TUserEntity.TUser): Promise<TSession['user']> {
        const {password, ...userWithoutPassword} = user
        return userWithoutPassword
    }
    async updateUser({id, data}: {id: number, data: Partial<TUserEntity.TUser>}): Promise<void> {
        await db.update(schema.tblUser).set(data).where(eq(schema.tblUser.id, id))
    }
}
