import { Wait } from "~/ui/wait.tsx"
import { useSuperLoaderData, useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/$gridId+/_route.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import type { WriteEventQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"

export function DetailsEventsItems() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_index",
    )?.resource as WriteEventQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.item_instances.map(({ id, item }) => (
                    <DetailsResourceCard
                        key={id}
                        label={item.type}
                        linkedResource={item}
                        navigateUrl={`items/${item.id}`}
                        unlinkUrl={`/write/${grid.id}/events/${resource.id}/items/${id}/unlink`}
                    />
                )),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/events/${resource.id}/items/${id}/link`
                    }
                    options={grid.items}
                />,
            ]}
        </Wait>
    )
}
