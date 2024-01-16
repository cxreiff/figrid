import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteTileQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/details/detailsResourceLinker.tsx"

export function DetailsTilesItems() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteTileQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.item_instances.map(({ id, item }) => (
                    <DetailsResourceCard
                        key={id}
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
