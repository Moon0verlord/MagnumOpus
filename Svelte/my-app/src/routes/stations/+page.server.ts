import {getInitialPorts} from "$lib/server/db";
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async () => {
    const chargingPorts = await getInitialPorts();

    return {
        props: {
            chargingPorts,
        }
    }
};