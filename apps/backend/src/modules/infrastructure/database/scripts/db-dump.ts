import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const dbUrl = process.env.DATABASE_URL_DEV;

if (!dbUrl) {
  console.error('DATABASE_URL_DEV environment variable is not set!');
  process.exit(1);
}

// Basit parse
const match = dbUrl.match(/postgresql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/);

if (!match) {
  console.error('DATABASE_URL_DEV is not in expected format!');
  process.exit(1);
}

const [, user, password, host, port, database] = match;

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputPath = path.resolve(`./data/db/dump/dump-${database}-${timestamp}.sql`);

const command = `pg_dump -h ${host} -p ${port} -U ${user} -d ${database} -s -F p -E UTF-8 -f ${outputPath}`;

try {
  console.log('Running command:', command);
  execSync(command, { stdio: 'inherit', env: { ...process.env, PGPASSWORD: password } });
  console.log(`Database dumped successfully to ${outputPath}`);
} catch (err) {
  console.error('Error dumping database:', err);
  process.exit(1);
}
