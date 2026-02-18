
import { tblPermission, tblRole, tblRolePermission } from "@repo/shared/schema";
import { TUserValidator } from "@repo/shared/validators";
import { and, asc, count, desc, eq, SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import db from "../../database";

export class RolePermissionRepositoryImpl {

    async createRolePermission(data: TUserValidator.TRolePermissionInsert): Promise<void> {
        await db.insert(tblRolePermission).values(data);
    }

    async createBulkRolePermission(data: TUserValidator.TCreateBulkRolePermissionSchema): Promise<void> {
        const { roleId, permissionIds } = data;
        const values = permissionIds.map(permissionId => ({
            roleId,
            permissionId
        }));
        await db.insert(tblRolePermission).values(values);
    }

    async deleteRolePermission(roleId: number, permissionId: number): Promise<void> {
        await db.delete(tblRolePermission)
            .where(and(eq(tblRolePermission.roleId, roleId), eq(tblRolePermission.permissionId, permissionId)));
    }


    async getAllRolePermissionsWithPagination(
        input: TUserValidator.TRolePermissionPaginationQuery,
    ) {
        const { pagination, sort, filter } = input;

        const andConditions: SQL<unknown>[] = [];

        if (filter?.roleId) {
            andConditions.push(eq(tblRolePermission.roleId, filter.roleId));
        }

        if (filter?.permissionId) {
            andConditions.push(eq(tblRolePermission.permissionId, filter.permissionId));
        }


        const whereCondition: SQL<unknown> | undefined = and(
            ...andConditions
        );

        const calculatedOrderBys: SQL<unknown>[] = [];
        const sortMapper = {
            'asc': asc,
            'desc': desc
        };
        const columnMapper: Record<string, PgColumn> = {
            'roleId': tblRolePermission.roleId,
            'permissionId': tblRolePermission.permissionId,
            'createdAt': tblRolePermission.createdAt,
        };

        if (sort) {
            sort.forEach(s => {
                if (columnMapper[s.sortField]) {
                    // TODO: fix this
                    //@ts-ignore
                    calculatedOrderBys.push(sortMapper[s.sortBy](columnMapper[s.sortField]));
                }
            });
        }


        const rolePermissions = await db.query.tblRolePermission.findMany({
            limit: pagination.limit,
            where: whereCondition,
            offset: (pagination.page - 1) * pagination.limit,
            orderBy: calculatedOrderBys,
            with: {
                // Assuming relations exist if defined in schema, otherwise just IDs
            }
        });

        const total = await db
            .select({ count: count() })
            .from(tblRolePermission)
            .where(whereCondition);

        const totalCount = total?.[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pagination.limit);

        return {
            data: rolePermissions,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: totalCount,
                totalPages: totalPages
            }
        };
    }



    async getAllRoles() {
        return await db.select().from(tblRole);
    }

    async getAllPermissions() {
        return await db.select().from(tblPermission);
    }
}
