import { PlayIcon } from "@radix-ui/react-icons"
import { Link } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@vercel/remix"
import { useState } from "react"
import { z } from "zod"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/components/layout.tsx"
import { LayoutTabs } from "~/components/layoutTabs.tsx"
import { Button } from "~/components/ui/button.tsx"
import { Card } from "~/components/ui/card.tsx"
import { Details } from "~/routes/write.$gridId/details/details.tsx"
import { Editor } from "~/routes/write.$gridId/editor/editor.tsx"
import { writeGridQuery } from "~/routes/write.$gridId/query.server.ts"
import { TilesTable } from "~/routes/write.$gridId/tilesTable.tsx"
import {
    ContextLayout,
    layoutCookieSchema,
    useInitialLayoutContext,
} from "~/utilities/contextLayout.ts"
import { getSessionLayout } from "~/utilities/sessionLayout.server.ts"
import { superjson, useSuperLoaderData } from "~/utilities/superjson.ts"

type ResourceType = "tile"
export type SelectedResource = { id: number; type: ResourceType } | undefined

const paramsSchema = z.object({ gridId: z.coerce.number() })

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

    const layoutContext = useInitialLayoutContext(layout)

    const [selected, setSelected] = useState<SelectedResource>(undefined)

    return (
        <ContextLayout.Provider value={layoutContext}>
            <Layout
                user={user}
                title={`${grid.name} - editing`}
                left={
                    <LayoutTabs names={["tiles", "characters", "items"]}>
                        <TilesTable
                            data={grid.tiles}
                            selected={selected}
                            onSelection={(id) =>
                                setSelected({ id, type: "tile" })
                            }
                        />
                        <Card className="h-full"></Card>
                        <Card className="h-full"></Card>
                    </LayoutTabs>
                }
                center={
                    <LayoutTabs names={["editor", "map"]}>
                        <Editor key={selected?.id} selected={selected} />
                        <Card className="h-full"></Card>
                    </LayoutTabs>
                }
                right={<Details selected={selected} />}
                iconButtons={[
                    <Button key={1} variant="ghost" size="icon" asChild>
                        <Link to={`/read/${grid.id}`}>
                            <PlayIcon className="h-5 w-5" />
                        </Link>
                    </Button>,
                ]}
                layoutRef={layoutContext.writeLayoutRef}
                initialLayout={layoutContext.initialLayout.write}
                onSaveLayout={layoutContext.saveLayout}
                onResetLayout={layoutContext.resetLayout}
            />
        </ContextLayout.Provider>
    )
}
