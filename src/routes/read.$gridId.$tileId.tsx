import { Form, useLoaderData } from "@remix-run/react"
import {
    type ActionFunctionArgs,
    json,
    type LoaderFunctionArgs,
    redirect,
} from "@vercel/remix"
import { TextTyper } from "~/components/textTyper.tsx"
import { db } from "~/database/database.server.ts"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { tiles, tiles_select_schema } from "~/database/schema/grids.server.ts"

export async function loader({ params }: LoaderFunctionArgs) {
    const { gridId, tileId } = z
        .object({
            gridId: z.coerce.number(),
            tileId: z.coerce.number(),
        })
        .parse(params)

    const [tile] = await db
        .select()
        .from(tiles)
        .where(eq(tiles.id, tileId))
        .limit(1)

    if (!tile || tile.grid_id !== gridId) {
        throw new Response("Not Found", { status: 404 })
    }

    return json({ tile })
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

export default function Room() {
    const { tile } = useLoaderData<typeof loader>()

    return (
        <div key={tile.id} className="p-12 text-center">
            <TextTyper
                className="pb-8 text-center"
                text={`${
                    tile.description || "[empty description]"
                }\n\nthere are exits to the ${[
                    tile.north_id && "north",
                    tile.east_id && "east",
                    tile.south_id && "south",
                    tile.west_id && "west",
                ]
                    .filter((dir) => dir != undefined)
                    .join(", ")}.`}
            />
            <Form method="post" replace preventScrollReset>
                {">"}
                <input
                    name="cmd"
                    className="border-b-2 border-stone-200 bg-transparent p-2 caret-stone-200 outline-none"
                    autoFocus
                />
                <input name="tile" defaultValue={JSON.stringify(tile)} hidden />
                <input type="submit" hidden />
            </Form>
        </div>
    )
}
