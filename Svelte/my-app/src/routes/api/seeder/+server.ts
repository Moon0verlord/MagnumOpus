// src/routes/api/seeder.ts
import {
    getData,
    allPortsAvailable,
    allStationsAvailable,
    Seeder,
    StationPortBalancer,
    PortDisplayNameGenerator, ClearPorts, ClearStations
} from "$lib/server/db/seeder";
import fs from 'fs';
import path from 'path';

export const GET = async () => {
    try {
        await ClearPorts();
        console.log("All port entries deleted.");
        await ClearStations();
        console.log("All station entries deleted.");
        const data = fs.readFileSync("src/lib/server/data/apidata.json", 'utf-8');
        const jsonData = await JSON.parse(data);
        console.log("JSON Data loaded.");
        const stationData = await getData(jsonData);
        console.log("Station data fetched.");
        await Seeder(stationData);
        console.log("Database seeding completed.");
        await allPortsAvailable();
        console.log("All ports set to available.");
        await allStationsAvailable();
        console.log("All stations set to available.");
        await StationPortBalancer();
        console.log("All station ports are balanced to a maximum, unneeded ports removed from DB.");
        await PortDisplayNameGenerator();
        console.log("Generated display name for all remaining ports.");
        
        console.log("Done!");
        return new Response(JSON.stringify(
                { message: "OK" }),
            { status: 200 });
    } catch (e: any) {
        console.error(e.message);
        console.error(e.stack);
        return new Response(JSON.stringify(
                { message: "Internal Error" }),
            { status: 500 });
    }
};