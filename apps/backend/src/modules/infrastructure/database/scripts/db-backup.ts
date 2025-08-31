import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Ortam parametresi (dev/prod)
const env = process.argv[2] || 'dev';
const dbUrl = env === 'prod' ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL_DEV;

if (!dbUrl) {
  console.error(`DATABASE_URL_${env.toUpperCase()} environment variable is not set!`);
  process.exit(1);
}

// DATABASE_URL parse (postgresql://user:password@host:port/database)
const match = dbUrl.match(/postgresql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/);

if (!match) {
  console.error('DATABASE_URL is not in expected format!');
  process.exit(1);
}

const [, user, password, host, port, database] = match;

// Dump dosyası: backup-dev-timestamp.sql
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputPath = path.resolve(`./data/db/backup/backup-${env}-${timestamp}.sql`);

// -s kaldırıldı → veri de alınacak
const command = `pg_dump -h ${host} -p ${port} -U ${user} -d ${database} -F p -E UTF-8 -f ${outputPath}`;

try {
  console.log(`Running backup for ${env} environment...`);
  execSync(command, { stdio: 'inherit', env: { ...process.env, PGPASSWORD: password } });
  console.log(`Backup completed successfully: ${outputPath}`);
} catch (err) {
  console.error('Error creating backup:', err);
  process.exit(1);
}
