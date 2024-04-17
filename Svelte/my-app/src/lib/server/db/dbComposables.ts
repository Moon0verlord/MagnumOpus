import {type Port, Ports, type Station, Stations} from "$lib/server/db/schema";
import {db} from "$lib/server/db/db.server";
import {eq} from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';
import {Users} from '$lib/server/db/schema';
import { Result } from "postcss";

export const GetAllPorts = async () : Promise<Port[]> => {
    return await db.select().from(Ports).execute();
};

export const GetAllStations = async () : Promise<Station[]> => {
    return await db.select().from(Stations).execute();
};

export const GetAllPortsFromStation = async (stationId: string) : Promise<Port[]> => {
    return await db.select().from(Ports).where(eq(Ports.stationId, stationId)).execute();
}

export async function PostUser(name: string, email: string, password: string) {
    try {
        const userId = uuidv4();
        const result = await db.insert(Users).values({userId, name, email, password}).execute();
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}