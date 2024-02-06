import { Wait } from "~/ui/wait.tsx"
import { useSuperLoaderData, useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteTileQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"

export function DetailsTilesItems() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteTileQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.item_instances.map(({ id, item }) => (
                    <DetailsResourceCard
                        key={id}
                        label={item.type}
                        linkedResource={item}
                        navigateUrl={`items/${item.id}`}
                        unlinkUrl={`/write/${grid.id}/tiles/${resource.id}/items/${id}/unlink`}
                    />
                )),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/tiles/${resource.id}/items/${id}/link`
                    }
                    options={grid.items}
                />,
            ]}
        </Wait>
    )
}
