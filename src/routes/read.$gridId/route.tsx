import { useState } from "react"
import { useLoaderData } from "@remix-run/react"
import { json, type LoaderFunctionArgs } from "@vercel/remix"
import { db } from "~/database/database.server.ts"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { grids } from "~/database/schema/grids.server.ts"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/components/layout.tsx"
import { Text } from "~/routes/read.$gridId/text.tsx"
import { Map } from "~/routes/read.$gridId/map.tsx"
import {
    generateIdMap,
    generateTileCoordsMap,
} from "~/routes/read.$gridId/processing.ts"
import { handleCommand } from "~/routes/read.$gridId/commands.ts"
import { useSaveData } from "~/utilities/useSaveData.ts"
import { LayoutTabs } from "~/components/layoutTabs.tsx"
import { Area } from "~/routes/read.$gridId/area.tsx"
import { Status } from "~/routes/read.$gridId/status.tsx"
import { Data } from "~/routes/read.$gridId/data.tsx"

const paramsSchema = z.object({ gridId: z.coerce.number() })

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { gridId } = paramsSchema.parse(params)

    const grid = await db.query.grids.findFirst({
        where: eq(grids.id, gridId),
        with: {
            tiles: {
                with: {
                    gates: true,
                    item_instances: {
                        with: {
                            item: true,
                        },
                    },
                    character_instances: {
                        with: {
                            character: true,
                        },
                    },
                },
            },
            items: true,
            item_instances: {
                with: {
                    item: true,
                },
            },
            player: true,
        },
    })

    if (!grid) {
        throw new Response(null, {
            status: 404,
            statusText: "Not Found",
        })
    }

    const tileIdMap = generateIdMap(grid.tiles)
    const itemIdMap = generateIdMap(grid.items)
    const itemInstanceIdMap = generateIdMap(grid.item_instances)
    const tileCoordsMap = generateTileCoordsMap(tileIdMap, grid.first_id)

    const user = await auth.isAuthenticated(request)

    return json({
        user,
        grid,
        tileIdMap,
        itemIdMap,
        itemInstanceIdMap,
        tileCoordsMap,
    })
}

export default function Route() {
    const {
        user,
        grid,
        tileIdMap,
        itemIdMap,
        itemInstanceIdMap,
        tileCoordsMap,
    } = useLoaderData<typeof loader>()

    const [command, setCommand] = useState("")
    const [commandLog, setCommandLog] = useState<string[]>([])
    const [saveData, setSaveData, replaceSave] = useSaveData(user, grid)

    const clearCommandLog = () => setCommandLog([])
    const appendToCommandLog = (command: string, message: string) =>
        setCommandLog([...commandLog, ">  " + command, message])

    const handleCommandClosure = (command: string) => {
        if (!saveData) return
        handleCommand(
            command,
            saveData,
            tileIdMap,
            itemInstanceIdMap,
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
            left={
                <LayoutTabs names={["area", "status", "data"]}>
                    <Area
                        saveData={saveData}
                        tileIdMap={tileIdMap}
                        handleCommand={handleCommandClosure}
                    />
                    <Status
                        saveData={saveData}
                        player={grid.player}
                        itemIdMap={itemIdMap}
                        itemInstanceIdMap={itemInstanceIdMap}
                        handleCommand={handleCommandClosure}
                    />
                    <Data
                        saveData={saveData}
                        userId={user?.id || 0}
                        gridId={grid.id}
                        tileIdMap={tileIdMap}
                        replaceSave={replaceSave}
                    />
                </LayoutTabs>
            }
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
