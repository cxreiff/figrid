import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

const create_update_timestamps = {
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),

  north: integer("north"),
  east: integer("east"),
  south: integer("south"),
  west: integer("west"),

  ...create_update_timestamps,
})

export const room_schema = createSelectSchema(rooms, {
  created_at: z.string(), // Dates are JSON serialized as strings.
  updated_at: z.string(), // Dates are JSON serialized as strings.
})
