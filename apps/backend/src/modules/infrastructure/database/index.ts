import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ENV } from "../../../env";
import schema, { tblLanguage } from "./schema";
// Use the appropriate database URL based on environment
const dbUrl = ENV._runtime.IS_DEV ? ENV.DATABASE_URL_DEV : ENV.DATABASE_URL_PROD;


// Parse the database URL to extract connection details
// const connectionUrl = new URL(dbUrl);

const pool = new Pool({
  connectionString: dbUrl,
  // Alternative: individual connection parameters
  // host: connectionUrl.hostname,
  // user: connectionUrl.username,
  // password: connectionUrl.password,
  // database: connectionUrl.pathname.substring(1),
  // port: connectionUrl.port ? parseInt(connectionUrl.port) : 5432,
  ssl: ENV._runtime.IS_DEV ? false : { rejectUnauthorized: false },
  max: 20, // Maximum number of connections in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
});









export type TDB = NodePgDatabase<typeof schema>;

export type TDbTableName = keyof typeof schema;
export type TDbTable = typeof schema[TDbTableName];


export type TDBTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export const startTransactionPromisfy = (): Promise<TDBTransaction> => {
  return new Promise((resolve, reject) => {
    db.transaction(async (trx) => {
      resolve(trx)
    })
  })
}


let db: TDB;

db = drizzle({ client: pool, schema });




export default db




