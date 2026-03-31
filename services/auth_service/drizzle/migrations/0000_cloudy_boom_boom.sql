CREATE TYPE "public"."token_purpose" AS ENUM('Register', 'Password Reset');--> statement-breakpoint
CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"last_login_at" date,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "token" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(100),
	"token" text NOT NULL,
	"is_used" boolean DEFAULT false,
	"purpose" "token_purpose" NOT NULL,
	"created_at" timestamp,
	"expires_at" timestamp,
	"usedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial NOT NULL,
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"last_login_at" date,
	"is_blocked" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" date,
	"verified_at" date,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "emailIdx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_idIdx" ON "user" USING btree ("user_id");