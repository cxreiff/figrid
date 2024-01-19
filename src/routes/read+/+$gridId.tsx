import { useState } from "react"
import { type LoaderFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/components/layout/layout.tsx"
import { Text } from "~/routes/read+/text/text.tsx"
import { Map } from "~/routes/read+/map/map.tsx"
import {
    generateIdMap,
    generateTileCoordsMap,
} from "~/routes/read+/processing.server.ts"
import { handleCommand } from "~/routes/read+/commands.ts"
import { useSaveData } from "~/lib/useSaveData.ts"
import { LayoutTabs } from "~/components/layout/layoutTabs.tsx"
import { Area } from "~/routes/read+/area/area.tsx"
import { Status } from "~/routes/read+/status/status.tsx"
import { Data } from "~/routes/read+/data/data.tsx"
import { gridQuery } from "~/routes/read+/queries.server.ts"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { ContextSaveData } from "~/lib/contextSaveData.ts"
import { ContextCommand } from "~/lib/contextCommand.ts"
import {
    ContextLayout,
    layoutCookieSchema,
    useInitialLayoutContext,
} from "~/lib/contextLayout.ts"
import { getSessionLayout } from "~/lib/sessionLayout.server.ts"
import { Button } from "~/components/ui/button.tsx"
import { Link } from "@remix-run/react"
import { Pencil2Icon } from "@radix-ui/react-icons"

const paramsSchema = z.object({ gridId: z.coerce.number() })

export async function loader({ request, params }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request)

    const { gridId } = paramsSchema.parse(params)

    const grid = await gridQuery(gridId)

    if (!grid) {
        throw new Response(null, {
            status: 404,
            statusText: "not found",
        })
    }

    const tileIdMap = generateIdMap(grid.tiles)
    const tileCoordsMap = generateTileCoordsMap(tileIdMap, grid.first_tile_id)
    const eventIdMap = generateIdMap(grid.events)
    const itemIdMap = generateIdMap(grid.items)
    const itemInstanceIdMap = generateIdMap(grid.item_instances)

    const sessionLayout = await getSessionLayout(request.headers.get("Cookie"))
    const layout = layoutCookieSchema.parse(sessionLayout.data)

    return superjson({
        user,
        grid,
        tileIdMap,
        tileCoordsMap,
        eventIdMap,
        itemIdMap,
        itemInstanceIdMap,
        layout,
    })
}

export default function Route() {
    const { user, grid, tileIdMap, eventIdMap, itemInstanceIdMap, layout } =
        useSuperLoaderData<typeof loader>()

    const [command, setCommand] = useState("")
    const [commandLog, setCommandLog] = useState<string[]>([])
    const [saveData, setSaveData, replaceSave] = useSaveData(user, grid)
    const layoutContext = useInitialLayoutContext(layout)

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
                <ContextLayout.Provider value={layoutContext}>
                    <Layout
                        user={user}
                        title={grid.name}
                        iconButtons={
                            <>
                                {grid.id === user?.id && (
                                    <Button
                                        key={1}
                                        variant="ghost"
                                        size="icon"
                                        asChild
                                    >
                                        <Link to={`/write/${grid.id}`}>
                                            <Pencil2Icon className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                            </>
                        }
                        layoutRef={layoutContext.readLayoutRef}
                        initialLayout={layoutContext.initialLayout.read}
                        minSizes={layoutContext.minSizes.read}
                        onSaveLayout={layoutContext.saveLayout}
                        onResetLayout={layoutContext.resetLayout}
                    >
                        <LayoutTabs names={["area", "status", "data"]}>
                            <Area />
                            <Status />
                            <Data replaceSave={replaceSave} />
                        </LayoutTabs>
                        <Text
                            saveData={saveData}
                            command={command}
                            commandLog={commandLog}
                            setCommand={setCommand}
                        />
                        <Map />
                    </Layout>
                </ContextLayout.Provider>
            </ContextCommand.Provider>
        </ContextSaveData.Provider>
    )
}
