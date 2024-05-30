import type { PageServerLoad } from "./$types";
import { myPorts, myRequests, incomingRequests, GetUserAdminStatus, allRequests, allOccupiedPorts } from "$lib/server/db/dbComposables";

export const load: PageServerLoad = async ({ cookies }) => {
    let userId = null;
    userId = cookies.get('userId');

    if (userId) {
        const [portsData, requestsData, incomingData, userData, allrequestData, alloccupiedportsData] = await Promise.all([
            myPorts(userId),
            myRequests(userId),
            incomingRequests(userId),
            GetUserAdminStatus(userId),
            allRequests(),
            allOccupiedPorts()
        ]);

        let ports, requests, incoming, user, admin, requestsAll, usedPorts;

        if (portsData !== null) {
            ports = portsData.map(port => ({ ...port, showContent: false }));
        }
        if (requestsData !== null) {
            requests = requestsData.map(request => ({ ...request, showContent: false }));
        }
        if (incomingData !== null) {
            incoming = incomingData.map(incoming => ({ ...incoming, showContent: false }));
        }
        if (userData !== null) {
            user = userData.pop();
            admin = user?.isAdmin;
        }
        if (allrequestData !== null) {
            requestsAll = allrequestData.map(request => ({ ...request, showContent: false }));
        }
        if (alloccupiedportsData !== null) {
            usedPorts = alloccupiedportsData.map(port => ({ ...port, showContent: false }));
        }

        return {
            props: {
                userId,
                ports,
                requests,
                incoming,
                user,
                admin,
                requestsAll,
                usedPorts
            }
        };
    }

    // If userId is not defined, return an empty props object
    return {
        props: {
            userId: null,
            ports: [],
            requests: [],
            incoming: [],
            user: null,
            admin: false,
            requestsAll: [],
            usedPorts: []
        }
    };
};