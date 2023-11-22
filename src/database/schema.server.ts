import { sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const create_update_timestamps = {
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
};

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),

  north: integer("north"),
  east: integer("east"),
  south: integer("south"),
  west: integer("west"),

  ...create_update_timestamps,
});

export const room_schema = createSelectSchema(rooms, {
  created_at: z.string(), // Dates are JSON serialized as strings.
  updated_at: z.string(), // Dates are JSON serialized as strings.
});

export async function create_functions(
  db: PostgresJsDatabase<Record<string, never>>,
) {
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION update_updated_at_fn()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now(); 
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);
}

export async function create_triggers(
  db: PostgresJsDatabase<Record<string, never>>,
) {
  await db.execute(sql`
    DO $$
    DECLARE t record;
    BEGIN
        FOR t IN
            SELECT * FROM information_schema.columns
            WHERE column_name = 'updated_at'
        LOOP
            EXECUTE format(
              'CREATE OR REPLACE TRIGGER update_updated_at_trigger
              BEFORE UPDATE ON %I.%I
              FOR EACH ROW EXECUTE PROCEDURE update_updated_at_fn()',
              t.table_schema,
              t.table_name
            );
        END LOOP;
    END;
    $$ LANGUAGE plpgsql;
  `);
}
