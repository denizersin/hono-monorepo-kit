import { timestamp } from "drizzle-orm/mysql-core";

export const getDefaultTableFields = () => {

    return {
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    }
}


export const getDefaultTableFieldsWithDeletedAt = () => {

    return {
        ...getDefaultTableFields(),
        deletedAt: timestamp('deleted_at'),
    }
}