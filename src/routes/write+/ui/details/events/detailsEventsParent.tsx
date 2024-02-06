import { Wait } from "~/ui/wait.tsx"
import { useSuperLoaderData, useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/$gridId+/_route.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_route.tsx"
import type { WriteEventQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"

export function DetailsEventsParent() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_route",
    )?.resource as WriteEventQuery

    return (
        <Wait on={resource}>
            {(resource) =>
                resource.parent ? (
                    <DetailsResourceCard
                        linkedResource={resource.parent}
                        navigateUrl={`events/${resource.parent_id}`}
                        unlinkUrl={`/write/${grid.id}/events/${resource.id}/parent/${resource.parent_id}/unlink`}
                    />
                ) : (
                    <DetailsResourceLinker
                        key="link"
                        getLinkUrl={(id) =>
                            `/write/${grid.id}/events/${resource.id}/parent/${id}/link`
                        }
                        options={grid.events.filter(
                            ({ id }) => resource.id !== id,
                        )}
                    />
                )
            }
        </Wait>
    )
}
