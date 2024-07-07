import { LayoutIcon, PlayIcon } from "@radix-ui/react-icons"
import { Outlet, useLocation, useParams } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/ui/layout/layout.tsx"
import { LayoutTabs } from "~/ui/layout/layoutTabs.tsx"
import { Details } from "~/routes/write+/ui/details/details.tsx"
import { writeGridQuery } from "~/routes/write+/lib/queries.server.ts"
import { ResourceStack } from "~/routes/write+/ui/resourceStack.tsx"
import {
    ContextLayout,
    layoutCookieSchema,
    useInitialLayoutContext,
} from "~/lib/contextLayout.ts"
import { getSessionLayout } from "~/lib/sessionLayout.server.ts"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { paramsSchema as childParamsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { useEffect, useRef } from "react"
import { Map } from "~/routes/write+/ui/map/map.tsx"
import {
    generateIdMap,
    generateTileCoordsMap,
} from "~/routes/read+/lib/processing.server.ts"
import { ButtonWithIconLink } from "~/ui/buttonWithIconLink.tsx"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { Grid } from "~/routes/write+/ui/grid/grid.tsx"
import { LayoutSplit } from "~/ui/layout/layoutSplit.tsx"
import { getSessionTabs } from "~/lib/sessionTabs.server.ts"
import {
    CENTER_TABS,
    ContextTabs,
    DETAILS_TABS,
    RESOURCE_TABS,
    WRITE_TABS,
    tabsCookieSchema,
    useInitialTabsContext,
} from "~/lib/contextTabs.ts"

export const RESOURCE_TYPES = {
    TILES: "tiles",
    CHARACTERS: "characters",
    ITEMS: "items",
    EVENTS: "events",
    GATES: "gates",
    LOCKS: "locks",
} as const
export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES]
export type SelectedResource = { id: number; type: ResourceType } | undefined

export const paramsSchema = z.object({
    gridId: z.coerce.number(),
})

export async function loader({ request, params }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/auth/login",
    })

    const { gridId } = paramsSchema.parse(params)

    const grid = await writeGridQuery(user.id, gridId)

    if (!grid) {
        throw new Response(null, {
            status: 404,
            statusText: "not found",
        })
    }

    if (grid.user_id !== user?.id) {
        throw new Response(null, {
            status: 403,
            statusText: "unauthorized",
        })
    }

    const cookie = request.headers.get("Cookie")
    const [sessionLayout, sessionTabs] = await Promise.all([
        getSessionLayout(cookie),
        getSessionTabs(cookie),
    ])
    const layout = layoutCookieSchema.parse(sessionLayout.data)
    const tabs = tabsCookieSchema.parse(sessionTabs.data)

    const tileIdMap = generateIdMap(grid.tiles)
    const tileCoordsMap = generateTileCoordsMap(tileIdMap, grid.first_tile_id)
    const gateIdMap = generateIdMap(grid.gates)
    const itemInstanceIdMap = generateIdMap(grid.item_instances)

    return superjson({
        user,
        grid,
        layout,
        tabs,
        tileIdMap,
        tileCoordsMap,
        gateIdMap,
        itemInstanceIdMap,
    })
}

export default function Route() {
    const { user, grid, layout, tabs } = useSuperLoaderData<typeof loader>()

    const { resourceType } = childParamsSchema.partial().parse(useParams())

    const { pathname } = useLocation()

    const prevPathname = useRef(pathname)

    const layoutContext = useInitialLayoutContext(layout)
    const tabsContext = useInitialTabsContext(tabs)

    useEffect(() => {
        if (pathname != prevPathname.current) {
            if (resourceType) {
                tabsContext.setResourceTab(resourceType)
            }

            if (pathname.endsWith("create")) {
                tabsContext.setCenterTab("editor")
                tabsContext.setWriteTab("editor")
            }

            prevPathname.current = pathname
        }
    }, [resourceType, tabsContext, pathname])

    const resources_section = (
        <LayoutTabs
            names={RESOURCE_TABS}
            value={tabsContext.resourceTab}
            onValueChange={tabsContext.setResourceTab}
        >
            <ResourceStack type={RESOURCE_TYPES.TILES} />
            <ResourceStack type={RESOURCE_TYPES.CHARACTERS} />
            <ResourceStack type={RESOURCE_TYPES.ITEMS} />
            <ResourceStack type={RESOURCE_TYPES.EVENTS} />
            <ResourceStack type={RESOURCE_TYPES.GATES} />
            <ResourceStack type={RESOURCE_TYPES.LOCKS} />
        </LayoutTabs>
    )

    const editor_section = <Outlet />

    const map_section = <Map />

    const center_section = (
        <LayoutTabs
            names={CENTER_TABS}
            value={tabsContext.centerTab}
            onValueChange={tabsContext.setCenterTab}
        >
            {map_section}
            {editor_section}
        </LayoutTabs>
    )

    const details_section = <Details />

    const grid_section = <Grid />

    const right_section = (
        <LayoutTabs
            names={DETAILS_TABS}
            value={tabsContext.detailsTab}
            onValueChange={tabsContext.setDetailsTab}
        >
            {details_section}
            {grid_section}
        </LayoutTabs>
    )

    return (
        <ContextLayout.Provider value={layoutContext}>
            <ContextTabs.Provider value={tabsContext}>
                <Layout
                    user={user}
                    title={`${grid.name} - editing`}
                    iconButtons={
                        <>
                            <ButtonWithIconLink
                                title="play"
                                to={`/read/${grid.id}`}
                                icon={PlayIcon}
                            />
                            <ButtonWithIcon
                                title="reset layout"
                                onClick={layoutContext.resetLayout}
                                icon={LayoutIcon}
                            />
                        </>
                    }
                >
                    <LayoutTabs
                        className="lg:hidden"
                        names={WRITE_TABS}
                        value={tabsContext.writeTab}
                        onValueChange={tabsContext.setWriteTab}
                    >
                        {resources_section}
                        {map_section}
                        {editor_section}
                        {details_section}
                        {grid_section}
                    </LayoutTabs>
                    <LayoutSplit
                        className="hidden lg:block"
                        direction="horizontal"
                        layoutRef={layoutContext.writeLayoutRef}
                        initialLayout={layoutContext.initialLayout.write}
                        minSizes={layoutContext.minSizes.write}
                        onSaveLayout={layoutContext.saveLayout}
                    >
                        {resources_section}
                        {center_section}
                        {right_section}
                    </LayoutSplit>
                </Layout>
            </ContextTabs.Provider>
        </ContextLayout.Provider>
    )
}
