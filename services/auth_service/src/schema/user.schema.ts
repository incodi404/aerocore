import {
  boolean,
  date,
  index,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: serial("id"), // auto-increament

    user_id: varchar("user_id", {
      length: 255,
    }).primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),

    last_login_at: date("last_login_at"),

    is_blocked: boolean("is_blocked").default(false),
    is_active: boolean("is_active").default(true),

    created_at: date("created_at"),
    verified_at: date("verified_at"),
  },
  // Indexing
  (table) => [
    index("emailIdx").on(table.email),
    index("user_idIdx").on(table.user_id),
  ],
);
