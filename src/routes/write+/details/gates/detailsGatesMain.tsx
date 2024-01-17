import { useSuperMatch } from "~/lib/superjson.ts"
import type { WriteGateQuery } from "~/routes/write+/queries.server.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { DetailsLabeledCard } from "~/routes/write+/details/detailsLabeledCard.tsx"

export function DetailsGatesMain() {
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteGateQuery

    return (
        <>
            <DetailsLabeledCard
                label="from"
                navigateUrl={`tiles/${resource.from_tile_id}`}
                resource={resource.from_tile}
            />
            <DetailsLabeledCard
                label="to"
                navigateUrl={`tiles/${resource.to_tile_id}`}
                resource={resource.to_tile}
            />
        </>
    )
}
