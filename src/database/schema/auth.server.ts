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
    text,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"
import {
    create_update_timestamps,
    incrementing_id,
} from "~/database/shared.server.ts"

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

export const users_insert_schema = createInsertSchema(users, {
    created_at: z.string(), // Dates are JSON serialized as strings.
    updated_at: z.string(), // Dates are JSON serialized as strings.
})

export type UsersSelectModel = InferSelectModel<typeof users>
export type UsersInsertModel = InferInsertModel<typeof users>

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

export type PasswordsSelectModel = InferSelectModel<typeof passwords>
export type PasswordsInsertModel = InferInsertModel<typeof passwords>

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

export type SessionsSelectModel = InferSelectModel<typeof sessions>
export type SessionsInsertModel = InferInsertModel<typeof sessions>

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

export type ConnectionsSelectModel = InferSelectModel<typeof connections>
export type ConnectionsInsertModel = InferInsertModel<typeof connections>

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

export type ProfilesSelectModel = InferSelectModel<typeof profiles>
export type ProfilesInsertModel = InferInsertModel<typeof profiles>