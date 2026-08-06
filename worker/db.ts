import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@shared/schema";

export type Database = NeonHttpDatabase<typeof schema>;

// Workers only expose bindings per-request, so the client is built inside the
// handler rather than at module scope the way the Express server did it.
export function createDb(databaseUrl: string): Database {
  return drizzle(neon(databaseUrl), { schema });
}
