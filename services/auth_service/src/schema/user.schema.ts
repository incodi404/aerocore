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
    id: serial("id").primaryKey(), // auto-increament

    userId: varchar("userId", {
      length: 255,
    }).notNull(),

    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),

    lastLoginAt: date("lastLoginAt"),

    isBlocked: boolean("isBlocked").default(false),
    isActive: boolean("isActive").default(true),

    createdAt: date("createdAt"),
    verifiedAt: date("verifiedAt"),
  },
  // Indexing
  (table) => [
    index("emailIdx").on(table.email),
    index("userIdIdx").on(table.userId),
  ],
);
