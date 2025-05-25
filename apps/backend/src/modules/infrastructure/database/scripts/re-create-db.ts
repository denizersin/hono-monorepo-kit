import { ENV } from "@server/env";
import mysql from "mysql2/promise";


console.log('reCreateDb executing..')



async function main() {
    if (!ENV._runtime.IS_DEV || ENV.NODE_ENV === 'production') {
        console.log('reCreateDb is not allowed in production')
        process.abort()
        return;
    }

    try {
        // Parse the database URL to get connection details
        const dbUrl = new URL(ENV.DATABASE_URL_DEV);
        const host = dbUrl.hostname;
        const port = parseInt(dbUrl.port || '3306', 10);
        const user = dbUrl.username;
        const password = dbUrl.password;
        
        // Create a direct connection to MySQL without specifying a database
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password
        });
        
        // Drop the database if it exists
        await connection.query(`DROP DATABASE IF EXISTS \`${ENV.DATABASE_NAME}\``);
        console.log(`Database ${ENV.DATABASE_NAME} dropped if it existed.`);
        
        // Verify the database doesn't exist
        const [rows] = await connection.query(`
            SELECT SCHEMA_NAME 
            FROM INFORMATION_SCHEMA.SCHEMATA 
            WHERE SCHEMA_NAME = ?
        `, [ENV.DATABASE_NAME]);
        
        if (Array.isArray(rows) && rows.length > 0) {
            console.error(`ERROR: Database ${ENV.DATABASE_NAME} still exists after attempting to drop it!`);
        } else {
            console.log(`Verified: Database ${ENV.DATABASE_NAME} does not exist.`);
            
            // Create the database
            await connection.query(`CREATE DATABASE \`${ENV.DATABASE_NAME}\``);
            console.log(`Database ${ENV.DATABASE_NAME} created.`);
        }
        
        await connection.end();

    } catch (error) {
        console.error("Error recreating database:", error);
    }
    finally {
        process.exit(0)
    }
}

main()



