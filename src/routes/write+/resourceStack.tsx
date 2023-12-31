import { useNavigate, useParams } from "@remix-run/react"
import { CardStack } from "~/components/cardStack.tsx"
import { Card } from "~/components/ui/card.tsx"
import { paramsSchema } from "~/routes/write+/+$gridId.$resourceType.$resourceId.tsx"
import type { ResourceType, loader } from "~/routes/write+/+$gridId.tsx"
import { useSuperLoaderData } from "~/lib/superjson.ts"

export function ResourceStack({ type }: { type: ResourceType }) {
    const { grid } = useSuperLoaderData<typeof loader>()
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())

    const navigate = useNavigate()

    return (
        <Card className="h-full p-4 pb-0">
            <CardStack
                columns={[{ accessorKey: "name" }]}
                type={type}
                data={grid[type]}
                selected={type === resourceType ? resourceId : undefined}
                onSelection={(id) => navigate(`${type}/${id}`)}
                onCreate={() => navigate(`${type}/create`)}
            />
        </Card>
    )
}
