import type { PageServerLoad } from "../../../.svelte-kit/types/src/routes/$types";
import { getInititalChargingPorts } from "$lib/server/db";

export const load = (() => {
    const chargingPorts = getInititalChargingPorts();

    return {
        chargingPorts
    }
}) satisfies PageServerLoad;