import { useState } from "react"
import { type LoaderFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/ui/layout/layout.tsx"
import { Text } from "~/routes/read+/ui/text/text.tsx"
import { Map } from "~/routes/read+/ui/map/map.tsx"
import {
    generateIdMap,
    generateTileCoordsMap,
} from "~/routes/read+/lib/processing.server.ts"
import { handleCommand } from "~/routes/read+/lib/commands.ts"
import { useSaveData } from "~/lib/useSaveData.ts"
import { LayoutTabs } from "~/ui/layout/layoutTabs.tsx"
import { Area } from "~/routes/read+/ui/area/area.tsx"
import { Status } from "~/routes/read+/ui/status/status.tsx"
import { Data } from "~/routes/read+/ui/data/data.tsx"
import { gridQuery } from "~/routes/read+/lib/queries.server.ts"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { ContextSaveData } from "~/lib/contextSaveData.ts"
import { ContextCommand } from "~/lib/contextCommand.ts"
import {
    ContextLayout,
    layoutCookieSchema,
    useInitialLayoutContext,
} from "~/lib/contextLayout.ts"
import { getSessionLayout } from "~/lib/sessionLayout.server.ts"
import { LayoutIcon, Pencil2Icon } from "@radix-ui/react-icons"
import { ButtonWithIconLink } from "~/ui/buttonWithIconLink.tsx"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { LayoutResponsive } from "~/ui/layout/layoutResponsive.tsx"

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

    const info_section = (
        <LayoutTabs names={["area", "status", "data"]}>
            <Area />
            <Status />
            <Data replaceSave={replaceSave} />
        </LayoutTabs>
    )

    const prompt_section = (
        <Text
            saveData={saveData}
            command={command}
            commandLog={commandLog}
            setCommand={setCommand}
        />
    )

    const map_section = <Map />

    return (
        <ContextSaveData.Provider value={saveData}>
            <ContextCommand.Provider value={handleCommandClosure}>
                <ContextLayout.Provider value={layoutContext}>
                    <Layout
                        user={user}
                        title={grid.name}
                        iconButtons={
                            <>
                                {grid.user_id === user?.id && (
                                    <ButtonWithIconLink
                                        to={`/write/${grid.id}`}
                                        icon={Pencil2Icon}
                                    />
                                )}
                                <ButtonWithIcon
                                    icon={LayoutIcon}
                                    onClick={layoutContext.resetLayout}
                                />
                            </>
                        }
                    >
                        <LayoutResponsive
                            names={["prompt", "info", "map"]}
                            layoutRef={layoutContext.readLayoutRef}
                            initialLayout={layoutContext.initialLayout.read}
                            minSizes={layoutContext.minSizes.read}
                            onSaveLayout={layoutContext.saveLayout}
                            tabsChildren={[
                                prompt_section,
                                info_section,
                                map_section,
                            ]}
                            splitChildren={[
                                info_section,
                                prompt_section,
                                map_section,
                            ]}
                        />
                    </Layout>
                </ContextLayout.Provider>
            </ContextCommand.Provider>
        </ContextSaveData.Provider>
    )
}
