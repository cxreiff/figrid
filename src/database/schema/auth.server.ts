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
    profile: one(profiles, {
        fields: [users.id],
        references: [profiles.user_id],
    }),
}))

export const passwords = mysqlTable("passwords", {
    ...create_update_timestamps,

    hash: text("hash").notNull(),

    user_id: int("user_id").primaryKey(),
})

export const passwords_relations = relations(passwords, ({ one }) => ({
    user: one(users, {
        fields: [passwords.user_id],
        references: [users.id],
    }),
}))

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

export const connections = mysqlTable(
    "connections",
    {
        ...incrementing_id,
        ...create_update_timestamps,

        provider_name: varchar("provider_name", { length: 256 })
            .unique()
            .notNull(),
        provider_id: varchar("provider_id", { length: 256 }).unique().notNull(),

        user_id: int("user_id"),
    },
    (t) => ({
        provider: uniqueIndex("provider").on(t.provider_id, t.provider_name),
    }),
)

export const connections_relations = relations(connections, ({ one }) => ({
    user: one(users, {
        fields: [connections.user_id],
        references: [users.id],
    }),
}))

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
