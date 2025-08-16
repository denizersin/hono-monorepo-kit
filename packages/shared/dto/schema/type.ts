import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import * as schema from "./index";


type TDb = PostgresJsDatabase<typeof schema>


export type ReturnTypeOfQuery<T extends (...args: any) => any> = NonNullable<Awaited<ReturnType<T>>>


export const mockDb: TDb = {} as TDb

