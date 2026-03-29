CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"lastLoginAt" date,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"lastLoginAt" date,
	"isBlocked" boolean DEFAULT false,
	"isActive" boolean DEFAULT true,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "emailIdx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "userIdIdx" ON "user" USING btree ("userId");