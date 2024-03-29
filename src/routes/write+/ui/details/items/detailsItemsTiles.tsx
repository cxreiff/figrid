import { Wait } from "~/ui/wait.tsx"
import { useSuperLoaderData, useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/$gridId+/_route.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import type { WriteItemQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"

export function DetailsItemsTiles() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_index",
    )?.resource as WriteItemQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.instances.map(
                    ({ id, tile }) =>
                        tile && (
                            <DetailsResourceCard
                                key={id}
                                linkedResource={tile}
                                navigateUrl={`tiles/${tile.id}`}
                                unlinkUrl={`/write/${grid.id}/items/${resource.id}/tiles/${id}/unlink`}
                            />
                        ),
                ),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/items/${resource.id}/tiles/${id}/link`
                    }
                    options={grid.tiles.filter(
                        (tile) =>
                            !resource.instances.find(
                                ({ tile_id }) => tile.id === tile_id,
                            ),
                    )}
                />,
            ]}
        </Wait>
    )
}
