import { timestamp } from "drizzle-orm/pg-core";

export const getDefaultTableFields = () => {

    return {
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    }
}


export const getDefaultTableFieldsWithDeletedAt = () => {

    return {
        ...getDefaultTableFields(),
        deletedAt: timestamp('deleted_at'),
    }
}