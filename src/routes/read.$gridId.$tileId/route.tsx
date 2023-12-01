import { useLoaderData } from "@remix-run/react"
import {
    type ActionFunctionArgs,
    json,
    type LoaderFunctionArgs,
    redirect,
} from "@vercel/remix"
import { db } from "~/database/database.server.ts"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { tiles, tiles_select_schema } from "~/database/schema/grids.server.ts"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/components/layout.tsx"
import { Text } from "~/routes/read.$gridId.$tileId/text.tsx"
import { Map } from "~/routes/read.$gridId.$tileId/map.tsx"
import { Info } from "~/routes/read.$gridId.$tileId/info.tsx"

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { gridId, tileId } = z
        .object({
            gridId: z.coerce.number(),
            tileId: z.coerce.number(),
        })
        .parse(params)

    const tile = await db.query.tiles.findFirst({
        where: eq(tiles.id, tileId),
        with: { grid: true },
    })

    if (!tile || tile.grid_id !== gridId) {
        throw new Response("Not Found", { status: 404 })
    }

    const user = await auth.isAuthenticated(request)

    return json({ user, tile })
}

export async function action({ request, params }: ActionFunctionArgs) {
    const { gridId } = z.object({ gridId: z.coerce.number() }).parse(params)
    const data = Object.fromEntries(await request.formData())
    const { cmd, tile } = z
        .object({
            cmd: z.string(),
            tile: z.preprocess(
                (r) => JSON.parse(String(r)),
                tiles_select_schema,
            ),
        })
        .parse(data)

    switch (cmd) {
        case "north":
            return tile.north_id
                ? redirect(`/read/${gridId}/${tile.north_id}`)
                : new Response("invalid direction")
        case "east":
            return tile.east_id
                ? redirect(`/read/${gridId}/${tile.east_id}`)
                : new Response("invalid direction")
        case "south":
            return tile.south_id
                ? redirect(`/read/${gridId}/${tile.south_id}`)
                : new Response("invalid direction")
        case "west":
            return tile.west_id
                ? redirect(`/read/${gridId}/${tile.west_id}`)
                : new Response("invalid direction")
        default:
            return new Response("invalid cmd")
    }
}

export default function Tile() {
    const { user, tile } = useLoaderData<typeof loader>()

    return (
        <Layout
            user={user}
            title={`${tile.grid.name} — ${tile.name}`}
            left={<Info />}
            right={<Map tile={tile} />}
            center={<Text tile={tile} />}
        />
    )
}
