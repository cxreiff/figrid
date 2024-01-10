import { relations } from "drizzle-orm"
import { boolean, int, mysqlTable } from "drizzle-orm/mysql-core"
import { users } from "~/database/schema/auth.server.ts"
import { events } from "~/database/schema/events.server.ts"
import { gates } from "~/database/schema/gates.server.ts"
import { grids } from "~/database/schema/grids.server.ts"
import { items } from "~/database/schema/items.server.ts"
import { locks } from "~/database/schema/locks.server.ts"
import {
    grid_resource_fields,
    name_summary_description,
} from "~/database/shared.server.ts"

export const requirements = mysqlTable("requirements", {
    ...grid_resource_fields,
    ...name_summary_description,

    lock_id: int("lock_id"),
    item_id: int("item_id"),

    event_id: int("event_id"),
    gate_id: int("gate_id"),

    inverse: boolean("inverse").default(false).notNull(),
    visible: boolean("visible").default(true).notNull(),
    consumes: boolean("consumes").default(false).notNull(),
})

export const requirements_relations = relations(requirements, ({ one }) => ({
    user: one(users, {
        fields: [requirements.user_id],
        references: [users.id],
    }),
    grid: one(grids, {
        fields: [requirements.grid_id],
        references: [grids.id],
    }),
    lock: one(locks, {
        fields: [requirements.lock_id],
        references: [locks.id],
    }),
    item: one(items, {
        fields: [requirements.item_id],
        references: [items.id],
    }),
    event: one(events, {
        fields: [requirements.event_id],
        references: [events.id],
    }),
    gate: one(gates, {
        fields: [requirements.gate_id],
        references: [gates.id],
    }),
}))
