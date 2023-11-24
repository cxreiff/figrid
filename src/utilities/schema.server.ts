import {
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/mysql-core"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

const createUpdateTimestamps = {
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull().onUpdateNow(),
}

export const rooms = mysqlTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),

  north: int("north"),
  east: int("east"),
  south: int("south"),
  west: int("west"),

  ...createUpdateTimestamps,
})

export const room_schema = createSelectSchema(rooms, {
  created_at: z.string(), // Dates are JSON serialized as strings.
  updated_at: z.string(), // Dates are JSON serialized as strings.
})
