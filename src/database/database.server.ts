import { remember } from "@epic-web/remember"
import { drizzle } from "drizzle-orm/planetscale-serverless"
import { connect } from "@planetscale/database"
import * as authSchema from "~/database/schema/auth.server.ts"
import * as entitiesSchema from "~/database/schema/entities.server.ts"
import * as eventsSchema from "~/database/schema/events.server.ts"
import * as gridsSchema from "~/database/schema/grids.server.ts"

export const db = remember("db", () =>
    drizzle(connect({ url: process.env.DATABASE_URL }), {
        schema: {
            ...authSchema,
            ...entitiesSchema,
            ...eventsSchema,
            ...gridsSchema,
        },
    }),
)
