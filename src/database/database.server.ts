import { remember } from "@epic-web/remember"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client/web"
import * as assetsSchema from "~/database/schema/assets.server.ts"
import * as authSchema from "~/database/schema/auth.server.ts"
import * as charactersSchema from "~/database/schema/characters.server.ts"
import * as eventsSchema from "~/database/schema/events.server.ts"
import * as likesSchema from "~/database/schema/likes.server.ts"
import * as gatesSchema from "~/database/schema/gates.server.ts"
import * as gridsSchema from "~/database/schema/grids.server.ts"
import * as itemsSchema from "~/database/schema/items.server.ts"
import * as locksSchema from "~/database/schema/locks.server.ts"
import * as tilesSchema from "~/database/schema/tiles.server.ts"

const connection = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_TOKEN,
})

const schema = {
    ...assetsSchema,
    ...authSchema,
    ...charactersSchema,
    ...eventsSchema,
    ...likesSchema,
    ...gatesSchema,
    ...gridsSchema,
    ...itemsSchema,
    ...locksSchema,
    ...tilesSchema,
}

export const db = remember("db", () => drizzle(connection, { schema }))
