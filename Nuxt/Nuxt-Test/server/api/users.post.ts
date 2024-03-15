import {InsertUserSchuberg, Users} from "~/db/schemas/schubergSchema";
import { db, sqlite } from "../sqlite-service"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const newUser: InsertUserSchuberg = { 
            ...body
        }
        const result = await db.insert(Users).values(newUser).run();
        return { newUser: result }
    }
    catch (e: any) {
        throw createError({
            statusCode: 400,
            statusMessage: e.message
        });
    }
});