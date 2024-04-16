// src/routes/api/seeder.ts
import {getData, allPortsAvailable, allStationsAvailable, Seeder} from "$lib/server/db/seeder";
import fs from 'fs';
import path from 'path';

export const GET = async () => {
    try {
        const data = fs.readFileSync("src/lib/server/data/apidata.json", 'utf-8');
        const jsonData = await JSON.parse(data);
        console.log("JSON Data loaded.");
        const stationData = await getData(jsonData);
        console.log("Station data fetched.");
        await Seeder(stationData);
        console.log("Seeder completed.");
        await allPortsAvailable();
        console.log("All ports set to available.");
        await allStationsAvailable();
        console.log("All stations set to available.");
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