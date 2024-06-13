import { relations } from "drizzle-orm"
import { sqliteTable } from "drizzle-orm/sqlite-core"
import { users } from "~/database/schema/auth.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { grid_resource_fields } from "~/database/shared.server.ts"

export const likes = sqliteTable("likes", {
    ...grid_resource_fields,
})

export const likes_relations = relations(likes, ({ one }) => ({
    grid: one(grids, {
        fields: [likes.grid_id],
        references: [grids.id],
    }),
    user: one(users, {
        fields: [likes.user_id],
        references: [users.id],
    }),
}))
