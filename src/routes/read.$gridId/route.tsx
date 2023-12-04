import { useState } from "react"
import { useLoaderData } from "@remix-run/react"
import { json, type LoaderFunctionArgs } from "@vercel/remix"
import { db } from "~/database/database.server.ts"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { grids, tiles } from "~/database/schema/grids.server.ts"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/components/layout.tsx"
import { Text } from "~/routes/read.$gridId/text.tsx"
import { Map } from "~/routes/read.$gridId/map.tsx"
import { Info } from "~/routes/read.$gridId/info.tsx"
import { generateTileCoordsMap } from "~/routes/read.$gridId/processing.ts"
import { handleCommand } from "~/routes/read.$gridId/commands.ts"

const paramsSchema = z.object({ gridId: z.coerce.number() })

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { gridId } = paramsSchema.parse(params)

    const [grid] = await db.select().from(grids).where(eq(grids.id, gridId))
    const gridTiles = await db
        .select()
        .from(tiles)
        .where(eq(tiles.grid_id, gridId))

    const tileIdMap = Object.fromEntries(
        gridTiles.map((tile) => [tile.id, tile]),
    )

    const tileCoordsMap = generateTileCoordsMap(tileIdMap, grid.first_id)

    const user = await auth.isAuthenticated(request)

    return json({ user, grid, tileIdMap, tileCoordsMap })
}

export default function Grid() {
    const { user, grid, tileIdMap, tileCoordsMap } =
        useLoaderData<typeof loader>()

    const [currentTileId, setCurrentTileId] = useState(grid.first_id)
    const [command, setCommand] = useState("")
    const [commandLog, setCommandLog] = useState<string[]>([])

    const tile = tileIdMap[currentTileId]

    const clearCommandLog = () => setCommandLog([])
    const appendToCommandLog = (command: string, message: string) =>
        setCommandLog([...commandLog, ">  " + command, message])

    const handleCommandClosure = (command: string) =>
        handleCommand(
            command,
            tile,
            tileIdMap,
            setCommand,
            appendToCommandLog,
            clearCommandLog,
            setCurrentTileId,
        )

    return (
        <Layout
            user={user}
            title={grid.name}
            subtitle={tile.name}
            left={<Info />}
            right={
                <Map
                    currentTileId={currentTileId}
                    tileIdMap={tileIdMap}
                    coordsMap={tileCoordsMap}
                    handleCommand={handleCommandClosure}
                />
            }
            center={
                <Text
                    tile={tile}
                    command={command}
                    commandLog={commandLog}
                    setCommand={setCommand}
                    handleCommand={handleCommandClosure}
                />
            }
        />
    )
}
