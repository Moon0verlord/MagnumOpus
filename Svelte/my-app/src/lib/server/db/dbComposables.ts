import {type Port, Ports, Requests, type Station, Stations, type User, Users} from "$lib/server/db/schema";
import {db} from "$lib/server/db/db.server";
import {and, eq} from "drizzle-orm";
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcryptjs';
import type {CarData} from "$lib/server/db/types";
import cars from "$lib/server/data/cars.json";
import carData from "$lib/server/data/cars.json";

export const GetAllPorts = async (): Promise<Port[]> => {
    return await db.select().from(Ports).execute();
};

export const GetAllStations = async (): Promise<Station[]> => {
    return await db.select().from(Stations).execute();
};

export const GetAllPortsFromStation = async (stationId: string): Promise<Port[]> => {
    return await db.select().from(Ports).where(eq(Ports.stationId, stationId)).execute();
}

export const GetUserAdminStatus = async (userId: string): Promise<User[]> => {
    return await db.select().from(Users).where(eq(Users.userId, userId)).execute();
}

export async function PostUser(name: string, email: string, password: string) {
    try {
        const userId = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await db.insert(Users).values({ userId, name, email, password: hashedPassword }).execute();
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

export async function getCurUser(id: string | null) {
    if (id !== null) {
        var NewId = id.replace(/"/g, '');
        var users = await db.select().from(Users).where(eq(Users.userId, NewId)).execute();
        return await users[0];
    } else {
        throw new Error("User ID cannot be null");
    }
}

function addHours(date: Date, hours: number): Date {
    const milliseconds = hours * 60 * 60 * 1000;
    return new Date(date.getTime() + milliseconds);
}

export async function ChangeUserLevel(email:string,level:number,xp:number){
    try {
        console.log(email,level,xp)
        let user =  await db.select().from(Users).where(eq(Users.email, email)).execute();
        user[0].level=level;
        if(xp==null) {
            user[0].totalXp = 0;
        }
        else{
            user[0].totalXp = xp;
        }
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

export async function reservePort(userId: string, portId: string, stationId: string,occupiedTime: Date) {
    try {
     
        const existingPort = await db.select().from(Ports).where(eq(Ports.usedBy, userId)).execute();
        if (existingPort.length > 0) {
            return "User has already reserved a port";
        }
        const chosenPort = await db.select().from(Ports).where(eq(Ports.portId, portId)).execute();
        const endTime = await GetEndTimeChargeEstimation(new Date(occupiedTime),userId,chosenPort[0].maxPower);
        
        await db.update(Ports)
            .set({usedBy: userId, status: 'occupied',OccupiedTime:new Date(occupiedTime),timeRemaining:endTime})
            .where(eq(Ports.portId, portId))
            .execute();

        const ports = await db.select().from(Ports).where(eq(Ports.stationId, stationId)).execute();

        if (ports.every(port => port.status === 'occupied')) {
            await db.update(Stations)
                .set({ overallStatus: 'occupied' })
                .where(eq(Stations.stationId, stationId))
                .execute();
        }

        return true;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetEndTimeChargeEstimation(occupiedTime:Date, userId: string,power: number | null) {
    //Asuming the Dutch average of 230V so 16A
    //Using battery size (kWh) / charger power (kW) = charging time (hours).

    try {
        const user = (await db.select().from(Users).where(eq(Users.userId, userId)).execute())[0];
        const PerCharge = await getCharge(user.userId);
        const port : Port[] = await db.select().from(Ports).where(eq(Ports.usedBy, userId)).execute();

        if (PerCharge && user.BatteryMax && power!=null)
        {
            const remainingCharge = (PerCharge / 100) * parseFloat(user.BatteryMax);
            var hours = (remainingCharge / power);
            console.log("Hours: "+addHours(occupiedTime,hours));
            return addHours(occupiedTime,hours);
        }
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
            .set({usedBy: null, status: 'available',OccupiedTime: null,timeRemaining: null})
            .where(eq(Ports.portId, portId))
            .execute();

        await db.update(Stations)
            .set({ overallStatus: 'available' })
            .where(eq(Stations.stationId, stationId))
            .execute();

        return true;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function requestPort(fromUserId: string, priority: string, requestedPortId: string, message: string,percent: number) {

    try {
        const existingRequest = 
            await db.select().from(Requests).where(and(eq(Requests.fromUserId, fromUserId), eq(Requests.requestedPortId, requestedPortId))).execute();
        if (existingRequest.length > 0) {
            return 2;
        }
        await db.insert(Requests).values({fromUserId, priority, requestedPortId, message,percent}).execute();

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
            .set({ usedBy: fromId, status: 'occupied' })
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
        const result = await db.insert(Users).values({ userId, name, email, oktaId }).execute();
        return { userId, result };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function checkPassword(currentPassword : string, userId: string) {
    try {
      const user = await db.select().from(Users).where(eq(Users.userId, userId)).execute();
  
      if (user && user.length > 0 && user[0].password) {
          return await bcrypt.compare(currentPassword, user[0].password);
      }
  
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  export async function changePassword(newPassword : string, userId : string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      await db.update(Users)
        .set({ password: hashedPassword })
        .where(eq(Users.userId, userId))
        .execute();
  
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

//Car selection functions and such 
export async function GetCars() {
    return cars as CarData;
}

export async function PostCar(car: string, userId: string,batteryCurrent: string): Promise<boolean> {
    try {
        const carModels: CarData = carData;
        let maxBattery: string | null = null;

        for (const brand in carModels) {
            const carModel = carModels[brand].find(c => c.model === car);
            if (carModel) {
                maxBattery = carModel.battery.toString();
                break;
            }
        }
        if(maxBattery!==null) {
            
            await db.update(Users)
                .set({carModel: car, BatteryMax: maxBattery, BatteryCurrent: batteryCurrent})
                .where(eq(Users.userId, userId))
                .execute();
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCharge(userId: string | null) {
    if(userId !== null) {
        try {
            const user = await db.select().from(Users).where(eq(Users.userId, userId)).execute();
            
            if (user[0] != null) {
                return user[0].BatteryCurrent && user[0].BatteryMax ? 100 - (parseFloat(user[0].BatteryCurrent)) : null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    else {
        throw new Error("User ID cannot be null");
    }
}
export async function GetInterCharge(userId: string |null, BatteryCurrent: string | null, BatteryMax: string | null) {
    try {
       
        if(userId !== null && BatteryCurrent !== null && BatteryMax !== null) {
            {
                const users : User[] = await db.select().from(Users).where(eq(Users.userId, userId)).execute();
                console.log("GetInterCharge: "+users.length)
                const user = users[0];
                const PerCharge = await getCharge(user.userId);
                const port: Port[] = await db.select().from(Ports).where(eq(Ports.usedBy, userId)).execute();
                const power = port[0].maxPower;
                const date = new Date()
                if (PerCharge && user.BatteryMax
                    && power != null
                    && port[0].OccupiedTime != null
                    && port[0].timeRemaining != null) {
                    const timePassed = (new Date().getTime() - port[0].OccupiedTime.getTime()) / 1000 / 60 / 60;
                    const chargePerHour = (PerCharge / port[0].timeRemaining.getHours());
                    const remainingCharge = (PerCharge / 100) * parseFloat(user.BatteryMax);
                    return remainingCharge - (chargePerHour * timePassed);
                }
            }
            console.log("1Finished");
        }
        else {
            throw new Error("User ID cannot be null");
        }
        console.log("2Finished");
    } catch (error) {
        console.error(error);
        return null;
    }
}

