import {
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const rooms = mysqlTable("rooms", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 256 }),
  description: text("description"),

  north: int("north"),
  east: int("east"),
  south: int("south"),
  west: int("west"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
