import { date, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const admin = pgTable("admin", {
  id: serial("id").notNull().primaryKey(),

  fullName: varchar("fullName", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  last_login_at: date("last_login_at"),
});
