import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/+$resourceId.tsx"
import type { WriteCharacterQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"

export function DetailsCharactersEvents() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteCharacterQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.event_instances.map(({ id, event }) => (
                    <DetailsResourceCard
                        key={id}
                        linkedResource={event}
                        navigateUrl={`events/${event.id}`}
                        unlinkUrl={`/write/${grid.id}/characters/${resource.id}/events/${id}/unlink`}
                    />
                )),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/characters/${resource.id}/events/${id}/link`
                    }
                    options={grid.events.filter(
                        (event) =>
                            event.parent_id === null &&
                            !resource.event_instances.find(
                                ({ event_id }) => event.id === event_id,
                            ),
                    )}
                />,
            ]}
        </Wait>
    )
}
