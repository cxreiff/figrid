import { useSuperRouteLoaderData } from "~/lib/superjson.ts"
import type { WriteGateQuery } from "~/routes/write+/lib/queries.server.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"

export function DetailsGatesMain() {
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_index",
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
