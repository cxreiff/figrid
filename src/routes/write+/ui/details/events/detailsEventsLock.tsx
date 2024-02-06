import { Wait } from "~/ui/wait.tsx"
import { useSuperLoaderData, useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/$gridId+/_route.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import type { WriteEventQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"

export function DetailsEventsLock() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteEventQuery

    return (
        <Wait on={resource}>
            {(resource) =>
                resource.triggers_lock ? (
                    <DetailsResourceCard
                        linkedResource={resource.triggers_lock}
                        navigateUrl={`locks/${resource.triggers_lock.id}`}
                        unlinkUrl={`/write/${grid.id}/events/${resource.id}/lock/${resource.triggers_lock.id}/unlink`}
                    />
                ) : (
                    <DetailsResourceLinker
                        key="link"
                        getLinkUrl={(id) =>
                            `/write/${grid.id}/events/${resource.id}/lock/${id}/link`
                        }
                        options={grid.locks.filter(
                            (lock) => lock.id !== resource.triggers_unlock_id,
                        )}
                    />
                )
            }
        </Wait>
    )
}
