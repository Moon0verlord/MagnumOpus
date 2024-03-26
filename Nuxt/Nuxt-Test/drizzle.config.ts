import type { Config } from "drizzle-kit";
export default {
    schema: "./db/schemas/schubergSchema.ts",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        connectionString: 'http://localhost:5432'
    }
} satisfies Config;