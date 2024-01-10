import { PlayIcon } from "@radix-ui/react-icons"
import { Link, Outlet, useParams } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@vercel/remix"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/components/layout.tsx"
import { LayoutTabs } from "~/components/layoutTabs.tsx"
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

export const RESOURCE_TYPES = {
    TILES: "tiles",
    CHARACTERS: "characters",
    ITEMS: "items",
    EVENTS: "events",
} as const
export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES]
export type SelectedResource = { id: number; type: ResourceType } | undefined

export const paramsSchema = z.object({
    gridId: z.coerce.number(),
})

export async function loader({ request, params }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request)

    const { gridId } = paramsSchema.parse(params)

    const grid = await writeGridQuery(gridId)

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

    return superjson({
        user,
        grid,
        layout,
    })
}

export default function Route() {
    const { user, grid, layout } = useSuperLoaderData<typeof loader>()

    const { resourceType } = childParamsSchema.partial().parse(useParams())
    const [resourceTab, setResourceTab] = useState(resourceType)

    const layoutContext = useInitialLayoutContext(layout)

    useEffect(() => {
        setResourceTab(resourceType)
    }, [resourceType])

    return (
        <ContextLayout.Provider value={layoutContext}>
            <Layout
                user={user}
                title={`${grid.name} - editing`}
                left={
                    <LayoutTabs
                        names={Object.values(RESOURCE_TYPES)}
                        value={resourceTab}
                        onValueChange={setResourceTab}
                    >
                        <ResourceStack type={RESOURCE_TYPES.TILES} />
                        <ResourceStack type={RESOURCE_TYPES.CHARACTERS} />
                        <ResourceStack type={RESOURCE_TYPES.ITEMS} />
                        <ResourceStack type={RESOURCE_TYPES.EVENTS} />
                    </LayoutTabs>
                }
                center={
                    <LayoutTabs names={["editor", "map"]}>
                        <Card className="h-full p-4">
                            <Outlet />
                        </Card>
                        <Card className="h-full"></Card>
                    </LayoutTabs>
                }
                right={
                    <LayoutTabs names={["details", "grid"]}>
                        <Details />
                        <Card className="h-full"></Card>
                    </LayoutTabs>
                }
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
                onSaveLayout={layoutContext.saveLayout}
                onResetLayout={layoutContext.resetLayout}
            />
        </ContextLayout.Provider>
    )
}
