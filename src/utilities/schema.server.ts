import {
    type InferInsertModel,
    type InferSelectModel,
    relations,
} from "drizzle-orm"
import {
    datetime,
    index,
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

const create_update_timestamps = {
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

    ...create_update_timestamps,
})

export const room_select_schema = createSelectSchema(rooms, {
    created_at: z.string(), // Dates are JSON serialized as strings.
    updated_at: z.string(), // Dates are JSON serialized as strings.
})

export type RoomsSelectModel = InferSelectModel<typeof rooms>
export type RoomsInsertModel = InferInsertModel<typeof rooms>

export const users = mysqlTable(
    "users",
    {
        id: int("id").primaryKey().unique().notNull().autoincrement(),
        email: varchar("email", { length: 256 }).unique().notNull(),
        alias: varchar("alias", { length: 256 }).unique().notNull(),
        name: varchar("name", { length: 256 }),

        type: mysqlEnum("type", ["standard", "creator", "admin"])
            .default("standard")
            .notNull(),

        ...create_update_timestamps,
    },
    (t) => ({
        email: uniqueIndex("email").on(t.email),
        alias: uniqueIndex("alias").on(t.alias),
    }),
)

export const users_relations = relations(users, ({ many, one }) => ({
    sessions: many(sessions),
    connections: many(connections),
    password: one(passwords, {
        fields: [users.id],
        references: [passwords.user_id],
    }),
    profiles: one(profiles, {
        fields: [users.id],
        references: [profiles.user_id],
    }),
}))

export const users_insert_schema = createInsertSchema(users, {
    created_at: z.string(), // Dates are JSON serialized as strings.
    updated_at: z.string(), // Dates are JSON serialized as strings.
})

export type UsersSelectModel = InferSelectModel<typeof users>
export type UsersInsertModel = InferInsertModel<typeof users>

export const passwords = mysqlTable("passwords", {
    user_id: int("user_id"),

    hash: text("hash").notNull(),

    ...create_update_timestamps,
})

export const passwords_relations = relations(passwords, ({ one }) => ({
    user: one(users, {
        fields: [passwords.user_id],
        references: [users.id],
    }),
}))

export type PasswordsSelectModel = InferSelectModel<typeof passwords>
export type PasswordsInsertModel = InferInsertModel<typeof passwords>

export const sessions = mysqlTable(
    "sessions",
    {
        user_id: int("user_id"),

        id: int("id").primaryKey().unique().notNull().autoincrement(),
        expiration_date: datetime("expiration_date").notNull(),

        ...create_update_timestamps,
    },
    (t) => ({
        user_id_index: index("user_id_index").on(t.user_id),
    }),
)

export const sessions_relations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.user_id],
        references: [users.id],
    }),
}))

export type SessionsSelectModel = InferSelectModel<typeof sessions>
export type SessionsInsertModel = InferInsertModel<typeof sessions>

export const connections = mysqlTable("connections", {
    user_id: int("user_id"),

    id: int("id").primaryKey().unique().notNull().autoincrement(),
    provider_name: varchar("provider_name", { length: 256 }).unique().notNull(),
    provider_id: varchar("provider_id", { length: 256 }).unique().notNull(),

    ...create_update_timestamps,
})

export const connections_relations = relations(connections, ({ one }) => ({
    user: one(users, {
        fields: [connections.user_id],
        references: [users.id],
    }),
}))

export type ConnectionsSelectModel = InferSelectModel<typeof connections>
export type ConnectionsInsertModel = InferInsertModel<typeof connections>

export const profiles = mysqlTable("profiles", {
    user_id: int("user_id"),

    id: int("id").primaryKey().unique().notNull().autoincrement(),
    image_url: varchar("image_url", { length: 2083 }),

    ...create_update_timestamps,
})

export const profiles_relations = relations(profiles, ({ one }) => ({
    user: one(users, {
        fields: [profiles.user_id],
        references: [users.id],
    }),
}))

export type ProfilesSelectModel = InferSelectModel<typeof profiles>
export type ProfilesInsertModel = InferInsertModel<typeof profiles>
