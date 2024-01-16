import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import type { loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteTileQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/details/detailsResourceLinker.tsx"
import type { loader } from "~/routes/write+/+$gridId.tsx"

const GATE_OPTIONS = [
    { id: "north", name: "north" },
    { id: "east", name: "east" },
    { id: "south", name: "south" },
    { id: "west", name: "west" },
    { id: "up", name: "up" },
    { id: "down", name: "down" },
]

export function DetailsTilesGates() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteTileQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.gates_out.map(({ id, to_tile, type }) => (
                    <DetailsResourceCard
                        key={id}
                        linkedResource={{ ...to_tile, type }}
                        navigateUrl={`tiles/${to_tile.id}`}
                    />
                )),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/tiles/${resource.id}/tiles/${id}/link`
                    }
                    options={GATE_OPTIONS.filter(
                        (option) =>
                            !resource.gates_out.find(
                                (gate) => gate.type === option.id,
                            ),
                    )}
                />,
            ]}
        </Wait>
    )
}
