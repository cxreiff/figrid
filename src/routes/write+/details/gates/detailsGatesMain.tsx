import { useSuperMatch } from "~/lib/superjson.ts"
import type { WriteGateQuery } from "~/routes/write+/queries.server.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"

export function DetailsGatesMain() {
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteGateQuery

    return (
        <>
            <DetailsResourceCard
                label="from"
                navigateUrl={`tiles/${resource.from_tile_id}`}
                linkedResource={resource.from_tile}
            />
            <DetailsResourceCard
                label="to"
                navigateUrl={`tiles/${resource.to_tile_id}`}
                linkedResource={resource.to_tile}
            />
        </>
    )
}
