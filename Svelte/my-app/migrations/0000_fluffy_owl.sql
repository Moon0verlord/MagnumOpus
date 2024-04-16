CREATE TABLE IF NOT EXISTS "Ports" (
	"port_id" text PRIMARY KEY NOT NULL,
	"station_id" text,
	"used_by" text,
	"emi3_id" text,
	"status" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Stations" (
	"station_id" text PRIMARY KEY NOT NULL,
	"location_id" text,
	"status" text,
	"coordinates" text,
	"address" json,
	"max_power" real,
	"port_ids" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"password" text,
	"okta_id" text,
	"isAdmin" boolean,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ports" ADD CONSTRAINT "Ports_station_id_Stations_station_id_fk" FOREIGN KEY ("station_id") REFERENCES "Stations"("station_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ports" ADD CONSTRAINT "Ports_used_by_Users_user_id_fk" FOREIGN KEY ("used_by") REFERENCES "Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
