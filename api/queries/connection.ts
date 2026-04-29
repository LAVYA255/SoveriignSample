import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb() {
  if (!instance) {
    if (!env.databaseUrl && !env.isProduction) {
      console.warn("No DATABASE_URL found, using dummy DB instance for development");
      // Return a proxy that ignores calls to prevent crash
      return new Proxy({}, { get: () => () => ({}) }) as any;
    }
    instance = drizzle(env.databaseUrl, {
      mode: "planetscale",
      schema: fullSchema,
    });
  }
  return instance;
}
