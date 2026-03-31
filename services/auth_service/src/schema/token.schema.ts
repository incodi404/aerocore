import {
  boolean,
  date,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const purposeEnum = pgEnum("token_purpose", [
  "Register",
  "Password Reset",
]);

export const token = pgTable("token", {
  id: serial("id").primaryKey(),

  // fk
  user_id: varchar("user_id", { length: 100 }).references(() => user.user_id, {
    onDelete: "cascade",
  }),

  token: text("token").notNull(),
  is_used: boolean("is_used").default(false),
  purpose: purposeEnum("purpose").notNull(),

  created_at: timestamp("created_at"),
  expires_at: timestamp("expires_at"),
  used_at: timestamp("usedAt"),
});
