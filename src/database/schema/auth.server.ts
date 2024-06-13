import { relations } from "drizzle-orm"
import {
    index,
    integer,
    text,
    uniqueIndex,
    sqliteTable,
} from "drizzle-orm/sqlite-core"
import { USER_TYPES } from "~/database/enums.ts"
import { likes } from "~/database/schema/likes.server.ts"
import {
    create_update_timestamps,
    incrementing_id,
} from "~/database/shared.server.ts"

export const users = sqliteTable(
    "users",
    {
        ...incrementing_id,
        ...create_update_timestamps,

        email: text("email", { length: 256 }).unique().notNull(),
        alias: text("alias", { length: 256 }).unique().notNull(),
        name: text("name", { length: 256 }),

        type: text("type", { enum: USER_TYPES }).default("standard").notNull(),
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
    likes: many(likes),
}))

export const passwords = sqliteTable("passwords", {
    ...create_update_timestamps,

    hash: text("hash").notNull(),

    user_id: integer("user_id").primaryKey(),
})

export const passwords_relations = relations(passwords, ({ one }) => ({
    user: one(users, {
        fields: [passwords.user_id],
        references: [users.id],
    }),
}))

export const sessions = sqliteTable(
    "sessions",
    {
        ...incrementing_id,
        ...create_update_timestamps,

        expiration_date: integer("expiration_date", {
            mode: "timestamp_ms",
        }).notNull(),

        user_id: integer("user_id"),
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

export const connections = sqliteTable(
    "connections",
    {
        ...incrementing_id,
        ...create_update_timestamps,

        provider_name: text("provider_name", { length: 256 })
            .unique()
            .notNull(),
        provider_id: text("provider_id", { length: 256 }).unique().notNull(),

        user_id: integer("user_id"),
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

export const profiles = sqliteTable("profiles", {
    ...incrementing_id,
    ...create_update_timestamps,

    image_url: text("image_url", { length: 2083 }),

    user_id: integer("user_id"),
})

export const profiles_relations = relations(profiles, ({ one }) => ({
    user: one(users, {
        fields: [profiles.user_id],
        references: [users.id],
    }),
}))
