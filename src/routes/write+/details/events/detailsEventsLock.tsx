import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteEventQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/details/detailsResourceLinker.tsx"

export function DetailsEventsLock() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
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
                        options={grid.locks}
                    />
                )
            }
        </Wait>
    )
}
