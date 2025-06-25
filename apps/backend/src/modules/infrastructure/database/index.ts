import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { ENV } from "../../../env";
import schema from "./schema";
// Use the appropriate database URL based on environment
const dbUrl = ENV._runtime.IS_DEV ? ENV.DATABASE_URL_DEV : ENV.DATABASE_URL_PROD;


// Parse the database URL to extract connection details
const connectionUrl = new URL(dbUrl);

const poolConnection = mysql.createPool({
  host: connectionUrl.hostname,
  user: connectionUrl.username,
  password: connectionUrl.password,
  database: connectionUrl.pathname.substring(1), // Remove leading slash
  port: connectionUrl.port ? parseInt(connectionUrl.port) : 3306,
});


export type TDB = MySql2Database<typeof schema>;

let db: TDB;

db = drizzle(poolConnection, { schema, mode: 'default' });

export default db




