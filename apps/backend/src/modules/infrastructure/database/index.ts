// Import database connection from @repo/db
import { db, pool, schema, startTransactionPromisfy } from "@repo/db";
import { tblLanguage } from "@repo/shared/schema";

export { db, pool, schema, startTransactionPromisfy };
export type { TDB, TDbTableName, TDbTable, TDBTransaction } from "@repo/db";
export { tblLanguage };
export default db;
