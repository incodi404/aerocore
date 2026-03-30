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

const purposeEnum = pgEnum("purpose", ["Register", "Password Reset"]);

export const token = pgTable("token", {
  id: serial("id").primaryKey(),

  // fk
  userId: varchar("userId", { length: 100 }).references(() => user.userId, {
    onDelete: "cascade",
  }),

  token: text("token").notNull(),
  isUsed: boolean("isUsed").default(false),
  purpose: purposeEnum("purpose").notNull(),

  createdAt: timestamp("createdAt"),
  expiresAt: timestamp("expiresAt"),
  usedAt: timestamp("usedAt"),
});
