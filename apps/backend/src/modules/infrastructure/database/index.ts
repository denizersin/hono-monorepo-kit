import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { schema } from "./schema";
import { ENV } from "../../../env";
import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";

// Use the appropriate database URL based on environment
const dbUrl = ENV._runtime.IS_DEV ? ENV.DATABASE_URL_DEV : ENV.DATABASE_URL_PROD;

const testScheme={
  tblUser2:mysqlTable('tblUser2',{
    id:int('id').primaryKey(),
    name:varchar('name',{length:255}).notNull(),
  })
}

// Parse the database URL to extract connection details
const connectionUrl = new URL(dbUrl);

const poolConnection =  mysql.createPool({
  host: connectionUrl.hostname,
  user: connectionUrl.username,
  password: connectionUrl.password,
  database: connectionUrl.pathname.substring(1), // Remove leading slash
  port: connectionUrl.port ? parseInt(connectionUrl.port) : 3306,
});

const db = drizzle(poolConnection, { schema, mode: 'default' });


async function test() {
  const result = await db.query.tblUser.findFirst({})
}
export default db;

export type TDB = typeof db;

