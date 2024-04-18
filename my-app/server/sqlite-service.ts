import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import {users} from "~/db/schemas/schema";

export const sqlite = new Database('./db/Project.db');
export const db =  drizzle(sqlite);