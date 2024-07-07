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
import {
    ContextTabs,
    INFO_TABS,
    READ_TABS,
    tabsCookieSchema,
    useInitialTabsContext,
} from "~/lib/contextTabs.ts"
import { getSessionLayout } from "~/lib/sessionLayout.server.ts"
import { LayoutIcon, Pencil2Icon } from "@radix-ui/react-icons"
import { ButtonWithIconLink } from "~/ui/buttonWithIconLink.tsx"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { LayoutSplit } from "~/ui/layout/layoutSplit.tsx"
import { getSessionTabs } from "~/lib/sessionTabs.server.ts"
import { AreaImage } from "./ui/area/areaImage.tsx"
import { Card } from "~/ui/primitives/card.tsx"

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

    const cookie = request.headers.get("Cookie")
    const [sessionLayout, sessionTabs] = await Promise.all([
        getSessionLayout(cookie),
        getSessionTabs(cookie),
    ])
    const layout = layoutCookieSchema.parse(sessionLayout.data)
    const tabs = tabsCookieSchema.parse(sessionTabs.data)

    return superjson({
        user,
        grid,
        tileIdMap,
        tileCoordsMap,
        eventIdMap,
        itemIdMap,
        itemInstanceIdMap,
        layout,
        tabs,
    })
}

export default function Route() {
    const {
        user,
        grid,
        tileIdMap,
        eventIdMap,
        itemInstanceIdMap,
        layout,
        tabs,
    } = useSuperLoaderData<typeof loader>()

    const [command, setCommand] = useState("")
    const [commandLog, setCommandLog] = useState<string[]>([])
    const [saveData, setSaveData, replaceSave] = useSaveData(user, grid)
    const layoutContext = useInitialLayoutContext(layout)
    const tabsContext = useInitialTabsContext(tabs)

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

    const area_section = <Area />

    const status_section = <Status />

    const data_section = <Data replaceSave={replaceSave} />

    const info_section = (
        <LayoutTabs
            names={INFO_TABS}
            value={tabsContext.infoTab}
            onValueChange={tabsContext.setInfoTab}
        >
            {area_section}
            {status_section}
            {data_section}
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

    const combo_section = (
        <LayoutSplit
            direction="vertical"
            layoutRef={layoutContext.comboLayoutRef}
            initialLayout={layoutContext.initialLayout.combo}
            minSizes={layoutContext.minSizes.combo}
            onSaveLayout={layoutContext.saveLayout}
        >
            <LayoutSplit
                direction="horizontal"
                layoutRef={layoutContext.visualsLayoutRef}
                initialLayout={layoutContext.initialLayout.visuals}
                minSizes={layoutContext.minSizes.visuals}
                onSaveLayout={layoutContext.saveLayout}
            >
                <Card className="h-full w-full py-4">
                    <AreaImage />
                </Card>
                {map_section}
            </LayoutSplit>
            {prompt_section}
        </LayoutSplit>
    )

    return (
        <ContextSaveData.Provider value={saveData}>
            <ContextCommand.Provider value={handleCommandClosure}>
                <ContextLayout.Provider value={layoutContext}>
                    <ContextTabs.Provider value={tabsContext}>
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
                            <LayoutTabs
                                className="lg:hidden"
                                names={READ_TABS}
                                value={tabsContext.readTab}
                                onValueChange={tabsContext.setReadTab}
                            >
                                {combo_section}
                                {map_section}
                                {area_section}
                                {status_section}
                                {data_section}
                            </LayoutTabs>
                            <LayoutSplit
                                className="hidden lg:block"
                                direction="horizontal"
                                layoutRef={layoutContext.readLayoutRef}
                                initialLayout={layoutContext.initialLayout.read}
                                minSizes={layoutContext.minSizes.read}
                                onSaveLayout={layoutContext.saveLayout}
                            >
                                {info_section}
                                {prompt_section}
                                {map_section}
                            </LayoutSplit>
                        </Layout>
                    </ContextTabs.Provider>
                </ContextLayout.Provider>
            </ContextCommand.Provider>
        </ContextSaveData.Provider>
    )
}
