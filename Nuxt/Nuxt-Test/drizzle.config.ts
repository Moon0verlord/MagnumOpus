import type { Config } from "drizzle-kit";
export default {
    schema: "./db/schemas/schubergSchema.ts",
    out: "./drizzle",
    driver: "better-sqlite",
    dbCredentials: {
        url: "./db/Project.db"
    }
} satisfies Config;