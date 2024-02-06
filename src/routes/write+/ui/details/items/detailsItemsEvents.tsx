import { Wait } from "~/ui/wait.tsx"
import { useSuperLoaderData, useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteItemQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"

export function DetailsItemsEvents() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteItemQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.instances.map(
                    ({ id, event }) =>
                        event && (
                            <DetailsResourceCard
                                key={id}
                                linkedResource={event}
                                navigateUrl={`events/${event.id}`}
                                unlinkUrl={`/write/${grid.id}/items/${resource.id}/events/${id}/unlink`}
                            />
                        ),
                ),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/items/${resource.id}/events/${id}/link`
                    }
                    options={grid.events}
                />,
            ]}
        </Wait>
    )
}
