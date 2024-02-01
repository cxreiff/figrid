import { Wait } from "~/ui/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/+$resourceId.tsx"
import type { WriteCharacterQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"

export function DetailsCharactersTiles() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteCharacterQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.instances.map(({ id, tile }) => (
                    <DetailsResourceCard
                        key={id}
                        linkedResource={tile}
                        navigateUrl={`tiles/${tile.id}`}
                        unlinkUrl={`/write/${grid.id}/characters/${resource.id}/tiles/${id}/unlink`}
                    />
                )),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/characters/${resource.id}/tiles/${id}/link`
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
