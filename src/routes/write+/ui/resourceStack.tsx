import { useLocation, useNavigate, useParams } from "@remix-run/react"
import { CardStack } from "~/ui/cardStack.tsx"
import { Card } from "~/ui/primitives/card.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import type { ResourceType, loader } from "~/routes/write+/$gridId+/_route.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import type { WriteGridQuery } from "~/routes/write+/lib/queries.server.ts"
import { useContext } from "react"
import { ContextTabs } from "~/lib/contextTabs.ts"

export function ResourceStack({ type }: { type: ResourceType }) {
    const { grid } = useSuperLoaderData<typeof loader>()
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())

    const tabsContext = useContext(ContextTabs)

    const navigate = useNavigate()

    const { pathname } = useLocation()
    const [, , , , createOrId] = pathname.split("/")
    const creating = resourceType === type && createOrId === "create"

    return (
        <Card className="h-full p-4 pb-0">
            <CardStack
                title={type}
                columns={[
                    {
                        accessorKey: "name",
                        cell: (data) => {
                            switch (type) {
                                case "gates":
                                    const gate = data.row
                                        .original as WriteGridQuery["gates"][0]
                                    return `${gate.from_tile.name} - ${gate.type}`
                                default:
                                    return data.getValue()
                            }
                        },
                    },
                ]}
                data={grid[type]}
                selected={type === resourceType ? resourceId : undefined}
                creating={creating}
                onSelection={(id) => {
                    navigate(`${type}/${id}`)
                    tabsContext.setWriteTab("editor")
                }}
                onCreate={
                    type !== "gates"
                        ? () => navigate(`${type}/create`)
                        : undefined
                }
            />
        </Card>
    )
}
