import {db} from "$lib/server/db/db.server"
import type {StationData, Status} from "$lib/server/db/types";
import {type Port, Requests, type Station} from "$lib/server/db/schema";
import {eq, sql} from "drizzle-orm";
import {Ports, Stations} from "$lib/server/db/schema";
// @ts-ignore
import { API_URL } from '$env/static/private';
import {list} from "postcss";

export const ClearRequests = async () => await db.delete(Requests);
export const ClearPorts = async () => await db.delete(Ports);
export const ClearStations = async () => await db.delete(Stations);

export const getData = async (json?: any) => {
    let stationData: StationData[] = [];
    try {
        let responseData;
        if (json == null)
        {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            responseData = await response.json();
        }
        else {
            responseData = json;
        }
        stationData = responseData.stationList.map((station: any) => ({
            id: station.id,
            locationId: station.locationId,
            reference: station.reference,
            status: station.status,
            coordinates: station.coordinates,
            address: station.address,
            maxPower: station.maxPower,
            evses: station.evses,
            connectors: station.connectors,
            visibilityScope: station.visibilityScope,
            accountId: station.accountId,
            externalAccountId: station.externalAccountId,
            externalParentAccountId: station.externalParentAccountId
        }));
        return stationData;
    } catch (error) {
        console.error('Error fetching station data:', error);
    }
    return stationData;
};

// use but one of these parameters.
const getPortIds = (data? : StationData, portArr?: string[]) : string => {
    let portIds = "";
    if (data != null)
    {
        for (const [i, value] of data.evses.entries()) {
            if (i === data.evses.length - 1)
                portIds += `${value.id}`
            else
                portIds += `${value.id},`
        }
    }
    else if (portArr != null)
    {
        for (const [i, value] of portArr.entries()) {
            if (i === portArr.length - 1)
                portIds += `${value}`
            else
                portIds += `${value},`
        }
    }
    return portIds
}

export const Seeder = async (data : StationData[]) => {
    for (const station of data) {
        await db.insert(Stations).values({
            stationId: station.id,
            locationId: station.locationId,
            overallStatus: station.status,
            coordinates: `${station.coordinates.lng},${station.coordinates.lat}`,
            address: JSON.stringify(station.address),
            maxPower: station.maxPower,
            portIds: getPortIds(station),
        })


        for (const port of station.evses) {
            await db.insert(Ports).values({
                portId: port.id,
                stationId: station.id,
                usedBy: null,
                emi3Id: port.emi3Id,
                status: port.status,
            });
        }
    }
}

export const allPortsAvailable = async () => {
    const allPorts = await db.select().from(Ports).execute();

    for (const port of allPorts) {
        await db.update(Ports)
            .set({ status: 'available' })
            .where(eq(Ports.portId, port.portId))
            .execute();
    }
}

export const allStationsAvailable = async () => {
    const allStations = await db.select().from(Stations).execute();
    for (const station of allStations) {
        const ports = await db.select().from(Ports).where(eq(Ports.stationId, station.stationId)).execute();
        await db.update(Stations)
            .set({ overallStatus: 'available' })
            .where(eq(Stations.stationId, station.stationId))
            .execute();
        for (const port of ports) {
                if (station.maxPower != null && ports.length > 1) {
                    const power = station.maxPower
                    await db.update(Ports)
                        .set({maxPower:power})
                        
                        .where(eq(Ports.portId, port.portId))
                        .execute();
                }
        }
    }
}

export const StationPortBalancer = async () => {
    const allStations: Station[] = await db.select().from(Stations).execute();
    let portsToRemove: string[] = [];
    const portsPerStation = 4;
    for (const station of allStations) {
        if (station.portIds != null && station.portIds.split(",").length > portsPerStation)
        {
            let allPortsofStation = station.portIds.split(",");
            portsToRemove = portsToRemove.concat(allPortsofStation.slice(portsPerStation));
            let newPortsofStation = getPortIds(undefined, allPortsofStation.slice(0, portsPerStation));
            await db.update(Stations).set({portIds: newPortsofStation}).where(eq(Stations.stationId, station.stationId)).execute();
        }
    }
    for (const port of portsToRemove) {
        await db.delete(Ports).where(eq(Ports.portId, port)).execute();
    } 
}

export const PortDisplayNameGenerator = async () => {
    const allStations: Station[] = await db.select().from(Stations).execute();
    for (const station of allStations)
    {
        const portsOfStation = await db.select().from(Ports).where(eq(Ports.stationId, station.stationId));
        for (const [i, value] of portsOfStation.entries())
        {
            // @ts-ignore
            let nameParts = JSON.parse(station.address.toString()).streetName.split(' ');
            if (!isNaN(Number(nameParts[nameParts.length - 1]))) {
                nameParts.pop();
            }
            let name = nameParts.join(' ') + `: Port ${i + 1}`;
            await db.update(Ports).set({displayName: name}).where(eq(Ports.portId, value.portId)).execute();
        }
    }
}