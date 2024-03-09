export type ChargePort =
{
    adress:string;
    available:string;
    power:number;
}
export type Station ={
    address: {
        streetName: string;
        city: string;
    };
    maxPower: number;
    evses: {
        status: string;
    }[];
}