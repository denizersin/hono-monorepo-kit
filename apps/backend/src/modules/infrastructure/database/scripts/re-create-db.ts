import { ENV } from "@server/env";
import { Client } from "pg";

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
        const port = parseInt(dbUrl.port || '5432', 10);
        const user = dbUrl.username;
        const password = dbUrl.password;

        // Connect to the default 'postgres' database to manage other databases
        const adminClient = new Client({
            host,
            port,
            user,
            password,
            database: 'postgres',
        });

        await adminClient.connect();

        // Terminate all connections to the target database before dropping
        try {
            await adminClient.query(`
                SELECT pg_terminate_backend(pid)
                FROM pg_stat_activity
                WHERE datname = $1 AND pid <> pg_backend_pid();
            `, [ENV.DATABASE_NAME]);
        } catch (e) {
            // Ignore errors if no connections exist
        }

        // Drop the database if it exists
        await adminClient.query(`DROP DATABASE IF EXISTS "${ENV.DATABASE_NAME}"`);
        console.log(`Database ${ENV.DATABASE_NAME} dropped if it existed.`);

        // Verify the database doesn't exist
        const res = await adminClient.query(`
            SELECT datname FROM pg_database WHERE datname = $1
        `, [ENV.DATABASE_NAME]);

        if (Array.isArray(res.rows) && res.rows.length > 0) {
            console.error(`ERROR: Database ${ENV.DATABASE_NAME} still exists after attempting to drop it!`);
        } else {
            console.log(`Verified: Database ${ENV.DATABASE_NAME} does not exist.`);

            // Create the database
            await adminClient.query(`CREATE DATABASE "${ENV.DATABASE_NAME}"`);
            console.log(`Database ${ENV.DATABASE_NAME} created.`);
        }

        await adminClient.end();

    } catch (error) {
        console.error("Error recreating database:", error);
    }
    finally {
        process.exit(0)
    }
}

main()
