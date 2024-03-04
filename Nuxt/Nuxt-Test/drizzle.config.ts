import type { Config } from "drizzle-kit";
export default {
    schema: "./db/schemas/schema.ts",
    out: "./drizzle",
    driver: "better-sqlite",
    dbCredentials: {
        url: "./db/Project.db"
    }
} satisfies Config;