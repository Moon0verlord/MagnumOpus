import {type InferInsertModel, type InferSelectModel, sql} from "drizzle-orm";
import {blob, integer, real, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {users} from "~/db/schemas/schema";

export enum Status {
    Available = "AVAILABLE",
    Charging = "CHARGING",
    Out_of_Order = "OUT_OF_ORDER"
}

export type Address = {
    state: string | null;
    streetName: string;
    postcode: string;
    city: string;
    country: {
        code: string;
        name: string;
    };
}

export const Users  = sqliteTable("Users", {
    userId: text("user_id").primaryKey(), // String because there is no Guid class, will make it ourselves.
    name: text("name"),
    email: text("email").unique(),
    password: text("password"),
    oktaId: text("okta_id"),
    isAdmin: integer("isAdmin", {mode: "boolean" })
});

export type InsertUserSchuberg = InferInsertModel<typeof Users>;

export const Stations = sqliteTable("Stations", {
    stationId: text("station_id").primaryKey(),
    locationId: text("location_id"),
    overallStatus: text("status"),
    coordinates: text("coordinates"), // needs to be parsed into an array on leaving
    address: blob("address"),
    maxPower: real("max_power"),
    portIds: text("port_ids") // needs to be parsed into an array on leaving
});

export const Ports = sqliteTable("Ports", {
   portId: text("port_id").primaryKey(),
   stationId: text("station_id").references(() => Stations.stationId), 
    usedBy: text("used_by").references(() => Users.userId),
    emi3Id: text("emi3_id"),
    status: text("status")
});



