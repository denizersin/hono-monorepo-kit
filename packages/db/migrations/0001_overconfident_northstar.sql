CREATE TABLE "roles" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "role" TO "role_id";