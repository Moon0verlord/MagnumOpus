CREATE TABLE IF NOT EXISTS "Requests" (
	"request_id" serial PRIMARY KEY NOT NULL,
	"priority" text,
	"from_userid" text,
	"requested_portid" text,
	"message" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Requests" ADD CONSTRAINT "Requests_from_userid_Users_user_id_fk" FOREIGN KEY ("from_userid") REFERENCES "Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Requests" ADD CONSTRAINT "Requests_requested_portid_Ports_port_id_fk" FOREIGN KEY ("requested_portid") REFERENCES "Ports"("port_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
