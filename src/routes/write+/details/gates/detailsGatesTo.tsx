import { Wait } from "~/components/wait.tsx"
import { useSuperMatch } from "~/lib/superjson.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteGateQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"

export function DetailsGatesTo() {
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteGateQuery

    return (
        <Wait on={resource}>
            {(resource) => (
                <DetailsResourceCard
                    linkedResource={resource.to_tile}
                    navigateUrl={`tiles/${resource.to_tile_id}`}
                />
            )}
        </Wait>
    )
}
