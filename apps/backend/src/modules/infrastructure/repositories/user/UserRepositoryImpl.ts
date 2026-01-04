import { IUserRepository } from "@server/modules/domain/repositories/IUserRepository";
import TUserEntity from "@server/modules/domain/entities/user/User";
import db from "../../database";
import { and, asc, count, desc, eq, isNull, like, or, sql, SQL } from "drizzle-orm";
import { tblUser } from "@repo/shared/schema";
import { TSession } from "@repo/shared/types";
import { TBaseValidators, TUserValidator } from "@repo/shared/validators";
import { PgColumn } from "drizzle-orm/pg-core";


export class UserRepositoryImpl implements IUserRepository {

    async getUserById(id: number): Promise<TUserEntity.TUser | undefined> {
        const user = await db.query.tblUser.findFirst({
            where: eq(tblUser.id, id)
        })
        return user;
    }

    async getUserByIdStrict(id: number): Promise<TUserEntity.TUser> {
        const user = await this.getUserById(id)
        if (!user) {
            throw new Error("User Entity not found")
        }
        return user
    }

    async getUserByEmail(email: string): Promise<TUserEntity.TUser | undefined> {
        const user = await db.query.tblUser.findFirst({
            where: eq(tblUser.email, email)
        })
        return user;
    }

    async createUser(user: TUserEntity.TUserInsert): Promise<number> {
        const [newUser] = await db.insert(tblUser).values(user).returning({ id: tblUser.id })
        if (!newUser) {
            throw new Error("User not created")
        }

        await db.execute(sql`
            SELECT setval(
              pg_get_serial_sequence('user', 'id'),
              COALESCE((SELECT MAX(id) FROM "user"), ${newUser.id}),
              true
            )
          `);
        return newUser.id
    }

    async getUserByEmailAndPassword(email: string, password: string): Promise<TUserEntity.TUser | undefined> {
        const user = await db.query.tblUser.findFirst({
            where: and(eq(tblUser.email, email), eq(tblUser.password, password))
        })
        return user;
    }

    async getSessionUser(user: TUserEntity.TUser): Promise<TSession['user']> {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
    async updateUser({ id, data }: { id: number, data: Partial<TUserEntity.TUser> }): Promise<void> {
        await db.update(tblUser).set(data).where(eq(tblUser.id, id))
    }

    async deleteUser(id: number): Promise<void> {
        // Soft delete: set deletedAt timestamp
        await db.update(tblUser).set({ deletedAt: new Date() }).where(eq(tblUser.id, id))
    }

    async getAllUsersWithPagination(
        input: TUserValidator.TUserPaginationQuery,
        companyId: number
    ): Promise<TBaseValidators.TPagination<Omit<TUserEntity.TUser, 'password'>>> {
        const { pagination, sort, global_search, filter } = input;

        const andConditions: SQL<unknown>[] = [];

        // Company filter - users can only see users from their company
        andConditions.push(eq(tblUser.companyId, companyId));

        if (filter.name) {
            andConditions.push(like(tblUser.name, `%${filter.name}%`));
        }

        if (filter.email) {
            andConditions.push(like(tblUser.email, `%${filter.email}%`));
        }

        if (filter.role) {
            andConditions.push(eq(tblUser.role, filter.role));
        }

        if (global_search) {
            andConditions.push(
                or(
                    like(tblUser.name, `%${global_search}%`),
                    like(tblUser.email, `%${global_search}%`),
                    like(tblUser.fullName, `%${global_search}%`)
                )!
            );
        }

        const whereCondition: SQL<unknown> | undefined = and(
            isNull(tblUser.deletedAt),
            ...andConditions
        );

        const calculatedOrderBys: SQL<unknown>[] = [];
        const sortMapper = {
            'asc': asc,
            'desc': desc
        };
        const columnMapper: Record<TUserValidator.TUserPaginationQuerySortKeys, PgColumn> = {
            'name': tblUser.name,
            'email': tblUser.email,
            'createdAt': tblUser.createdAt,
        };

        sort.forEach(s => {
            calculatedOrderBys.push(sortMapper[s.sortBy](columnMapper[s.sortField]));
        });

        const users = await db.query.tblUser.findMany({
            limit: pagination.limit,
            where: whereCondition,
            offset: (pagination.page - 1) * pagination.limit,
            orderBy: calculatedOrderBys,
            columns: {
                password: false,
            }
        });

        const total = await db
            .select({ count: count() })
            .from(tblUser)
            .where(whereCondition);

        const totalCount = total?.[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pagination.limit);

        return {
            data: users,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: totalCount,
                totalPages: totalPages
            }
        };
    }
}



