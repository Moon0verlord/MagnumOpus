// db/db.+server.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// if this gives an error, run 'npm run dev' first to create your environment variables.
// make SURE to have a .env file with the DATABASE_URL variable.
import { DATABASE_URL } from '$env/static/private';
import { dev } from '$app/environment';

// production build version if we want to enable SSL.
// const client = dev ? postgres(DATABASE_URL) : postgres(DATABASE_URL, { ssl: 'require' });
const client =  postgres(DATABASE_URL)
export const db = drizzle(client, {});