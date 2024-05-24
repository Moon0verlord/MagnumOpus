export type Car = {
    make: string;
    model: string;
    battery: number;
}

export type CarData = {
    [make: string]: Car[];
}