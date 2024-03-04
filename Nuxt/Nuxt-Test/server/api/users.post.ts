import { users, User, InsertUser} from "~/db/schemas/schema";
import { db, sqlite } from "../sqlite-service"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const newUser: InsertUser = { 
            ...body
        }
        const result = await db.insert(users).values(newUser).run();
        return { newUser: result}
    }
    catch (e: any) {
        throw createError({
            statusCode: 400,
            statusMessage: e.message
        });
    }
});