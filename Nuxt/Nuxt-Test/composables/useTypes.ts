
export interface StationData {
    id: string;
    locationId: string;
    reference: string | null;
    status: string;
    coordinates: {
        lng: number;
        lat: number;
    };
    address: {
        state: string | null;
        streetName: string;
        postcode: string;
        city: string;
        country: {
            code: string;
            name: string;
        };
    };
    maxPower: number;
    evses: {
        id: string;
        emi3Id: string;
        status: string;
        connectors: Array<any>;
    }[];
    connectors: {
        status: string;
        type: string;
        format: string;
    }[];
    visibilityScope: string;
    accountId: string | null;
    externalAccountId: string | null;
    externalParentAccountId: string | null;
}