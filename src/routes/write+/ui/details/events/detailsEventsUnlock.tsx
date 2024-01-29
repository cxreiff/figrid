import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/+$resourceId.tsx"
import type { WriteEventQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"

export function DetailsEventsUnlock() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteEventQuery

    return (
        <Wait on={resource}>
            {(resource) =>
                resource.triggers_unlock ? (
                    <DetailsResourceCard
                        linkedResource={resource.triggers_unlock}
                        navigateUrl={`locks/${resource.triggers_unlock.id}`}
                        unlinkUrl={`/write/${grid.id}/events/${resource.id}/unlock/${resource.triggers_unlock.id}/unlink`}
                    />
                ) : (
                    <DetailsResourceLinker
                        key="link"
                        getLinkUrl={(id) =>
                            `/write/${grid.id}/events/${resource.id}/unlock/${id}/link`
                        }
                        options={grid.locks.filter(
                            (lock) => lock.id !== resource.triggers_lock_id,
                        )}
                    />
                )
            }
        </Wait>
    )
}
