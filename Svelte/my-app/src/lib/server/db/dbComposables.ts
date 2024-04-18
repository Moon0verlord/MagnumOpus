import {type Port, Ports, type Station, Stations, type User, Users} from "$lib/server/db/schema";
import {db} from "$lib/server/db/db.server";
import {eq} from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';
import { Result } from "postcss";
import bcrypt from 'bcryptjs';

export const GetAllPorts = async () : Promise<Port[]> => {
    return await db.select().from(Ports).execute();
};

export const GetAllStations = async () : Promise<Station[]> => {
    return await db.select().from(Stations).execute();
};

export const GetAllPortsFromStation = async (stationId: string) : Promise<Port[]> => {
    return await db.select().from(Ports).where(eq(Ports.stationId, stationId)).execute();
}

export const GetUserAdminStatus = async (userId: string) : Promise<User[]> => {
    return await db.select().from(Users).where(eq(Users.userId, userId)).execute();
}

export async function PostUser(name: string, email: string, password: string) {
    try {
        const userId = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await db.insert(Users).values({userId, name, email, password: hashedPassword}).execute();
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function loginUser(email: string, password: string) {
    try {
        const user = await db.select().from(Users).where(eq(Users.email, email)).execute();

        if (user && user.length > 0 && user[0].password) {
            const match = await bcrypt.compare(password, user[0].password);
            if (match) {
                return user[0];
            }
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}