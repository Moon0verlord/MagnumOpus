import {type InferInsertModel, type InferSelectModel, sql} from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core"

export const Users  = pg.pgTable("Users", {
    userId: pg.text("user_id").primaryKey(),
    name: pg.text("name"),
    email: pg.text("email").unique(),
    password: pg.text("password"),
    oktaId: pg.text("okta_id"),
    isAdmin: pg.boolean('isAdmin')
});

export type User = InferSelectModel<typeof Users>;

export type InsertUserSchuberg = InferInsertModel<typeof Users>;

export const Stations = pg.pgTable("Stations", {
    stationId: pg.text("station_id").primaryKey(),
    locationId: pg.text("location_id"),
    overallStatus: pg.text("status"),
    coordinates: pg.text("coordinates"),
    address: pg.json("address"),
    maxPower: pg.real("max_power"),
    portIds: pg.text("port_ids") // needs to be parsed into an array on leaving
});

export type Station = InferSelectModel<typeof Stations>;

export const Ports = pg.pgTable("Ports", {
    portId: pg.text("port_id").primaryKey(),
    stationId: pg.text("station_id").references(() => Stations.stationId),
    usedBy: pg.text("used_by").references(() => Users.userId),
    emi3Id: pg.text("emi3_id"),
    status: pg.text("status"),
    displayName: pg.text("display_name"),
});

export type Port = InferSelectModel<typeof Ports>;


