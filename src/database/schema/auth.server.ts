import { relations } from "drizzle-orm"
import {
    datetime,
    index,
    int,
    mysqlEnum,
    mysqlTable,
    text,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core"
import type { z } from "zod"
import {
    create_update_timestamps,
    incrementing_id,
    fixer,
} from "~/database/shared.server.ts"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const users = mysqlTable(
    "users",
    {
        ...incrementing_id,
        ...create_update_timestamps,

        email: varchar("email", { length: 256 }).unique().notNull(),
        alias: varchar("alias", { length: 256 }).unique().notNull(),
        name: varchar("name", { length: 256 }),

        type: mysqlEnum("type", ["standard", "creator", "admin"])
            .default("standard")
            .notNull(),
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

export const users_select_schema = createSelectSchema(users, fixer)
export const users_insert_schema = createInsertSchema(users, fixer)
export type UsersSelectModel = z.infer<typeof users_select_schema>
export type UsersInsertModel = z.infer<typeof users_insert_schema>

export const passwords = mysqlTable("passwords", {
    ...create_update_timestamps,

    hash: text("hash").notNull(),

    user_id: int("user_id"),
})

export const passwords_relations = relations(passwords, ({ one }) => ({
    user: one(users, {
        fields: [passwords.user_id],
        references: [users.id],
    }),
}))

export const passwords_select_schema = createSelectSchema(passwords, fixer)
export const passwords_insert_schema = createInsertSchema(passwords, fixer)
export type PasswordsSelectModel = z.infer<typeof passwords_select_schema>
export type PasswordsInsertModel = z.infer<typeof passwords_insert_schema>

export const sessions = mysqlTable(
    "sessions",
    {
        ...incrementing_id,
        ...create_update_timestamps,

        expiration_date: datetime("expiration_date").notNull(),

        user_id: int("user_id"),
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

export const sessions_select_schema = createSelectSchema(sessions, fixer)
export const sessions_insert_schema = createInsertSchema(sessions, fixer)
export type SessionsSelectModel = z.infer<typeof sessions_select_schema>
export type SessionsInsertModel = z.infer<typeof sessions_insert_schema>

export const connections = mysqlTable("connections", {
    ...incrementing_id,
    ...create_update_timestamps,

    provider_name: varchar("provider_name", { length: 256 }).unique().notNull(),
    provider_id: varchar("provider_id", { length: 256 }).unique().notNull(),

    user_id: int("user_id"),
})

export const connections_relations = relations(connections, ({ one }) => ({
    user: one(users, {
        fields: [connections.user_id],
        references: [users.id],
    }),
}))

export const connections_select_schema = createSelectSchema(connections, fixer)
export const connections_insert_schema = createInsertSchema(connections, fixer)
export type ConnectionsSelectModel = z.infer<typeof connections_select_schema>
export type ConnectionsInsertModel = z.infer<typeof connections_insert_schema>

export const profiles = mysqlTable("profiles", {
    ...incrementing_id,
    ...create_update_timestamps,

    image_url: varchar("image_url", { length: 2083 }),

    user_id: int("user_id"),
})

export const profiles_relations = relations(profiles, ({ one }) => ({
    user: one(users, {
        fields: [profiles.user_id],
        references: [users.id],
    }),
}))

export const profiles_select_schema = createSelectSchema(profiles, fixer)
export const profiles_insert_schema = createInsertSchema(profiles, fixer)
export type ProfilesSelectModel = z.infer<typeof profiles_select_schema>
export type ProfilesInsertModel = z.infer<typeof profiles_insert_schema>
