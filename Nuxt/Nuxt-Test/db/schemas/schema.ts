import {type InferInsertModel, type InferSelectModel, sql} from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: integer("id").primaryKey(),
    userName: text("username"),
    userPassword: text("password"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;