import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteEventQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/details/detailsResourceLinker.tsx"

export function DetailsEventsRequirements() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteEventQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.locked_by.map(({ id, lock }) => (
                    <DetailsResourceCard
                        key={id}
                        linkedResource={lock}
                        navigateUrl={`locks/${lock.id}`}
                        unlinkUrl={`/write/${grid.id}/events/${resource.id}/requirements/${id}/unlink`}
                    />
                )),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/events/${resource.id}/requirements/${id}/link`
                    }
                    options={grid.locks.filter(
                        ({ instances }) =>
                            !instances.find(
                                ({ event_id }) => resource.id === event_id,
                            ),
                    )}
                />,
            ]}
        </Wait>
    )
}
