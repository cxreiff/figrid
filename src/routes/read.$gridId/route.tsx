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
import { useSaveData } from "~/utilities/useSaveData.ts"

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

export default function Route() {
    const { user, grid, tileIdMap, tileCoordsMap } =
        useLoaderData<typeof loader>()

    const [command, setCommand] = useState("")
    const [commandLog, setCommandLog] = useState<string[]>([])
    const [saveData, setSaveData] = useSaveData(user, grid)

    const clearCommandLog = () => setCommandLog([])
    const appendToCommandLog = (command: string, message: string) =>
        setCommandLog([...commandLog, ">  " + command, message])

    const handleCommandClosure = (command: string) => {
        if (!saveData) return
        handleCommand(
            command,
            saveData,
            tileIdMap,
            setCommand,
            appendToCommandLog,
            clearCommandLog,
            setSaveData,
        )
    }

    return (
        <Layout
            user={user}
            title={grid.name}
            left={<Info />}
            right={
                <Map
                    saveData={saveData}
                    tileIdMap={tileIdMap}
                    coordsMap={tileCoordsMap}
                    handleCommand={handleCommandClosure}
                />
            }
            center={
                <Text
                    saveData={saveData}
                    tileIdMap={tileIdMap}
                    command={command}
                    commandLog={commandLog}
                    setCommand={setCommand}
                    handleCommand={handleCommandClosure}
                />
            }
        />
    )
}
