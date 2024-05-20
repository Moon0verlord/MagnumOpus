import {type Port, Ports, Requests, type Station, Stations, type User, Users} from "$lib/server/db/schema";
import {db} from "$lib/server/db/db.server";
import {and, eq} from "drizzle-orm";
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcryptjs';

export const GetAllPorts = async (): Promise<Port[]> => {
    return await db.select().from(Ports).execute();
};

export const GetAllStations = async (): Promise<Station[]> => {
    return await db.select().from(Stations).execute();
};

export const GetAllPortsFromStation = async (stationId: string): Promise<Port[]> => {
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
export async function getCurUser(id:string|null){
    if (id !== null) {
        var NewId = id.replace(/"/g, '');
        var users = await db.select().from(Users).where(eq(Users.userId, NewId)).execute();
        return await users[0];
    } else {
        throw new Error("User ID cannot be null");
    }
}
export async function ChangeUserLevel(email:string,level:number,xp:number){
    try {
        let user =  await db.select().from(Users).where(eq(Users.email, email)).execute();
        user[0].level=level;
        user[0].totalXp=xp;
        await db.update(Users).set(user[0]).where(eq(Users.email, email)).execute();
        console.log(`User level changed to ${level}`);
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
export async function ChangeUserXp(email:string,xp:number) {
    try {
        let user =  await db.select().from(Users).where(eq(Users.email, email)).execute();
        user[0].totalXp=xp;
        await db.update(Users).set(user[0]).where(eq(Users.email, email)).execute();
        console.log(`User xp changed to ${xp}`);
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
export async function reservePort(userId: string, portId: string, stationId: string) {
    try {
        const existingPort = await db.select().from(Ports).where(eq(Ports.usedBy, userId)).execute();
        if (existingPort.length > 0) {
            return "User has already reserved a port";
        }

        await db.update(Ports)
            .set({usedBy: userId, status: 'occupied'})
            .where(eq(Ports.portId, portId))
            .execute();

        const ports = await db.select().from(Ports).where(eq(Ports.stationId, stationId)).execute();

        if (ports.every(port => port.status === 'occupied')) {
            await db.update(Stations)
                .set({overallStatus: 'occupied'})
                .where(eq(Stations.stationId, stationId))
                .execute();
        }

        return true;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function allOccupiedPorts() {
    try {
        return await db.select().from(Ports).where(eq(Ports.status, 'occupied')).execute();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function myPorts(userId: string) {
    try {
        return await db.select().from(Ports).where(eq(Ports.usedBy, userId)).execute();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function releasePort(portId: string, stationId: string) {
    try {
        await db.update(Ports)
            .set({usedBy: null, status: 'available'})
            .where(eq(Ports.portId, portId))
            .execute();

        await db.update(Stations)
            .set({overallStatus: 'available'})
            .where(eq(Stations.stationId, stationId))
            .execute();

        return true;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function requestPort(fromUserId: string, priority: string, requestedPortId: string, message: string) {
    try {
        const existingRequest = await db.select().from(Requests).where(and(eq(Requests.fromUserId, fromUserId), eq(Requests.requestedPortId, requestedPortId))).execute();
        if (existingRequest.length > 0) {
            return 2;
        }

        await db.insert(Requests).values({fromUserId, priority, requestedPortId, message}).execute();

        return 1;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function myRequests(userId: string) {
    try {
        const result = await db.select()
            .from(Requests)
            .innerJoin(Ports, and(eq(Requests.requestedPortId, Ports.portId)))
            .where(eq(Requests.fromUserId, userId))
            .execute();

        return result.map(item => {
            return {
                requestId: item["Requests"].requestId,
                priority: item["Requests"].priority,
                fromUserId: item["Requests"].fromUserId,
                requestedPortId: item["Requests"].requestedPortId,
                message: item["Requests"].message,
                displayName: item["Ports"].displayName
            };
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function cancelRequest(requestId: number) {
    try {
        await db.delete(Requests).where(eq(Requests.requestId, requestId)).execute();
        return true;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function allRequests() {
    try {
        const result = await db.select()
            .from(Requests)
            .innerJoin(Users, and(eq(Requests.fromUserId, Users.userId)))
            .innerJoin(Ports, and(eq(Requests.requestedPortId, Ports.portId)))
            .execute();

        return result.map(item => {
            return {
                requestId: item["Requests"].requestId,
                priority: item["Requests"].priority,
                fromUserId: item["Requests"].fromUserId,
                requestedPortId: item["Requests"].requestedPortId,
                message: item["Requests"].message,
                displayName: item["Ports"].displayName,
                name: item["Users"].name,
                email: item["Users"].email
            };
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function incomingRequests(userId: string) {
    try {
        // send back requests that are meant for the port of the user
        const result = await db.select()
            .from(Requests)
            .innerJoin(Ports, and(eq(Requests.requestedPortId, Ports.portId)))
            .where(eq(Ports.usedBy, userId))
            .execute();

        return result.map(item => {
            return {
                requestId: item["Requests"].requestId,
                priority: item["Requests"].priority,
                fromUserId: item["Requests"].fromUserId,
                requestedPortId: item["Requests"].requestedPortId,
                message: item["Requests"].message,
                displayName: item["Ports"].displayName
            };
        });

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function acceptRequest(fromId: string, requestedPortId: string) {
    try {
        // remove user from any ports they are currently using then give them the requested port and remove the all requests
        const existingPort = await db.select().from(Ports).where(eq(Ports.usedBy, fromId)).execute();
        if (existingPort.length > 0) {
            // call releasePort
            const stationId = existingPort[0].stationId;
            await releasePort(existingPort[0].portId, stationId!);
        }

        await db.update(Ports)
            .set({usedBy: fromId, status: 'occupied'})
            .where(eq(Ports.portId, requestedPortId))
            .execute();

        await db.delete(Requests).where(eq(Requests.fromUserId, fromId)).execute();

        return true;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetUserByEmail(email: string) {
    try {
        return await db.select().from(Users).where(eq(Users.email, email)).execute();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function PostOktauser(name: string, email: string, oktaId: string) {
    try {
        const userId = uuidv4();
        const result = await db.insert(Users).values({userId, name, email, oktaId}).execute();
        return {userId, result};
    } catch (error) {
        console.error(error);
        return null;
    }
}
// Calculate power per port 
