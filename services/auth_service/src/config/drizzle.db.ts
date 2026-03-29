import { drizzle } from "drizzle-orm/node-postgres";
import { pgPool } from "./postgres";
import schema from "../schema/index.schema";

export const postgreDb = drizzle(pgPool, { schema: schema });