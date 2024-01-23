import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/+$resourceId.tsx"
import type { WriteItemQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/details/detailsResourceLinker.tsx"

export function DetailsItemsTiles() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
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
