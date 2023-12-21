import { useState } from "react"
import { type LoaderFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/components/layout.tsx"
import { Text } from "~/routes/read.$gridId/text/text.tsx"
import { Map } from "~/routes/read.$gridId/map/map.tsx"
import {
    generateIdMap,
    generateTileCoordsMap,
} from "~/routes/read.$gridId/processing.server.ts"
import { handleCommand } from "~/routes/read.$gridId/commands.ts"
import { useSaveData } from "~/utilities/useSaveData.ts"
import { LayoutTabs } from "~/components/layoutTabs.tsx"
import { Area } from "~/routes/read.$gridId/area/area.tsx"
import { Status } from "~/routes/read.$gridId/status/status.tsx"
import { Data } from "~/routes/read.$gridId/data/data.tsx"
import { gridQuery } from "~/routes/read.$gridId/query.server.ts"
import { superjson, useSuperLoaderData } from "~/utilities/superjson.ts"
import { ContextSaveData } from "~/utilities/contextSaveData.ts"
import { ContextCommand } from "~/utilities/contextCommand.ts"

const paramsSchema = z.object({ gridId: z.coerce.number() })

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { gridId } = paramsSchema.parse(params)

    const grid = await gridQuery(gridId)

    if (!grid) {
        throw new Response(null, {
            status: 404,
            statusText: "Not Found",
        })
    }

    const tileIdMap = generateIdMap(grid.tiles)
    const eventIdMap = generateIdMap(grid.events)
    const itemIdMap = generateIdMap(grid.items)
    const itemInstanceIdMap = generateIdMap(grid.item_instances)
    const tileCoordsMap = generateTileCoordsMap(tileIdMap, grid.first_id)

    const user = await auth.isAuthenticated(request)

    return superjson({
        user,
        grid,
        tileIdMap,
        eventIdMap,
        itemIdMap,
        itemInstanceIdMap,
        tileCoordsMap,
    })
}

export default function Route() {
    const { user, grid, tileIdMap, eventIdMap, itemInstanceIdMap } =
        useSuperLoaderData<typeof loader>()

    const [command, setCommand] = useState("")
    const [commandLog, setCommandLog] = useState<string[]>([])
    const [saveData, setSaveData, replaceSave] = useSaveData(user, grid)

    const clearCommandLog = () => setCommandLog([])
    const appendToCommandLog = (command: string, message: string) =>
        setCommandLog([...commandLog, ">  " + command, message])

    const handleCommandClosure = (command: string) => {
        if (!saveData) return
        setCommand(
            handleCommand(
                command,
                saveData,
                tileIdMap,
                eventIdMap,
                itemInstanceIdMap,
                appendToCommandLog,
                clearCommandLog,
                setSaveData,
            ),
        )
    }

    return (
        <ContextSaveData.Provider value={saveData}>
            <ContextCommand.Provider value={handleCommandClosure}>
                <Layout
                    user={user}
                    title={grid.name}
                    left={
                        <LayoutTabs names={["area", "status", "data"]}>
                            <Area />
                            <Status />
                            <Data replaceSave={replaceSave} />
                        </LayoutTabs>
                    }
                    right={<Map />}
                    center={
                        <Text
                            saveData={saveData}
                            command={command}
                            commandLog={commandLog}
                            setCommand={setCommand}
                        />
                    }
                />
            </ContextCommand.Provider>
        </ContextSaveData.Provider>
    )
}
