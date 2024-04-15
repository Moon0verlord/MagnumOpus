import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
    throw new Error('No database URL set in .env file');
}
export default {
    schema: './src/lib/server/db/schema.ts',
    out: './migrations',
    driver: 'pg',
    dbCredentials: {
        connectionString: DATABASE_URL,
    }
} satisfies Config;