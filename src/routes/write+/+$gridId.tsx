import { PlayIcon } from "@radix-ui/react-icons"
import { Link, Outlet, useLocation, useParams } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/components/layout/layout.tsx"
import { LayoutTabs } from "~/components/layout/layoutTabs.tsx"
import { Button } from "~/components/ui/button.tsx"
import { Card } from "~/components/ui/card.tsx"
import { Details } from "~/routes/write+/details/details.tsx"
import { writeGridQuery } from "~/routes/write+/queries.server.ts"
import { ResourceStack } from "~/routes/write+/resourceStack.tsx"
import {
    ContextLayout,
    layoutCookieSchema,
    useInitialLayoutContext,
} from "~/lib/contextLayout.ts"
import { getSessionLayout } from "~/lib/sessionLayout.server.ts"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { paramsSchema as childParamsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { useEffect, useState } from "react"
import { Map } from "~/routes/write+/map/map.tsx"
import {
    generateIdMap,
    generateTileCoordsMap,
} from "~/routes/read+/processing.server.ts"

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

    const sessionLayout = await getSessionLayout(request.headers.get("Cookie"))
    const layout = layoutCookieSchema.parse(sessionLayout.data)

    const tileIdMap = generateIdMap(grid.tiles)
    const tileCoordsMap = generateTileCoordsMap(tileIdMap, grid.first_tile_id)
    const gateIdMap = generateIdMap(grid.gates)
    const itemInstanceIdMap = generateIdMap(grid.item_instances)

    return superjson({
        user,
        grid,
        layout,
        tileIdMap,
        tileCoordsMap,
        gateIdMap,
        itemInstanceIdMap,
    })
}

export default function Route() {
    const { user, grid, layout } = useSuperLoaderData<typeof loader>()

    const { resourceType } = childParamsSchema.partial().parse(useParams())
    const [resourceTab, setResourceTab] = useState(resourceType)
    const [mainTab, setMainTab] = useState<"map" | "editor">("map")

    const { pathname } = useLocation()

    const layoutContext = useInitialLayoutContext(layout)

    useEffect(() => {
        setResourceTab(resourceType)
    }, [resourceType])

    useEffect(() => {
        if (pathname.endsWith("create")) {
            setMainTab("editor")
        }
    }, [pathname])

    return (
        <ContextLayout.Provider value={layoutContext}>
            <Layout
                user={user}
                title={`${grid.name} - editing`}
                iconButtons={
                    <>
                        <Button variant="ghost" size="icon" asChild>
                            <Link to={`/read/${grid.id}`}>
                                <PlayIcon className="h-5 w-5" />
                            </Link>
                        </Button>
                    </>
                }
                layoutRef={layoutContext.writeLayoutRef}
                initialLayout={layoutContext.initialLayout.write}
                minSizes={layoutContext.minSizes.write}
                onSaveLayout={layoutContext.saveLayout}
                onResetLayout={layoutContext.resetLayout}
            >
                <LayoutTabs
                    names={Object.values(RESOURCE_TYPES)}
                    value={resourceTab}
                    onValueChange={setResourceTab}
                >
                    <ResourceStack type={RESOURCE_TYPES.TILES} />
                    <ResourceStack type={RESOURCE_TYPES.CHARACTERS} />
                    <ResourceStack type={RESOURCE_TYPES.ITEMS} />
                    <ResourceStack type={RESOURCE_TYPES.EVENTS} />
                    <ResourceStack type={RESOURCE_TYPES.GATES} />
                    <ResourceStack type={RESOURCE_TYPES.LOCKS} />
                </LayoutTabs>
                <LayoutTabs
                    names={["map", "editor"]}
                    value={mainTab}
                    onValueChange={setMainTab}
                >
                    <Map />
                    <Outlet />
                </LayoutTabs>
                <LayoutTabs names={["details", "grid"]}>
                    <Details />
                    <Card className="h-full"></Card>
                </LayoutTabs>
            </Layout>
        </ContextLayout.Provider>
    )
}
