import { MySql2Database } from "drizzle-orm/mysql2";

import * as schema from "./index";


type TDb = MySql2Database<typeof schema>


export type ReturnTypeOfQuery<T extends (...args: any) => any> = NonNullable<Awaited<ReturnType<T>>>


export const mockDb: TDb = {} as TDb

