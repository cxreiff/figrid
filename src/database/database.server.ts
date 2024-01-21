import { remember } from "@epic-web/remember"
import { drizzle } from "drizzle-orm/planetscale-serverless"
import { connect } from "@planetscale/database"
import * as assetsSchema from "~/database/schema/assets.server.ts"
import * as authSchema from "~/database/schema/auth.server.ts"
import * as charactersSchema from "~/database/schema/characters.server.ts"
import * as eventsSchema from "~/database/schema/events.server.ts"
import * as gatesSchema from "~/database/schema/gates.server.ts"
import * as gridsSchema from "~/database/schema/grids.server.ts"
import * as itemsSchema from "~/database/schema/items.server.ts"
import * as locksSchema from "~/database/schema/locks.server.ts"
import * as tilesSchema from "~/database/schema/tiles.server.ts"

export const db = remember("db", () =>
    drizzle(connect({ url: process.env.DATABASE_URL }), {
        schema: {
            ...assetsSchema,
            ...authSchema,
            ...charactersSchema,
            ...eventsSchema,
            ...gatesSchema,
            ...gridsSchema,
            ...itemsSchema,
            ...locksSchema,
            ...tilesSchema,
        },
    }),
)
