import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import type { loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteLockQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/details/detailsResourceLinker.tsx"
import type { loader } from "~/routes/write+/+$gridId.tsx"

export function DetailsLocksGates() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteLockQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.instances
                    .filter(({ gate_id }) => gate_id)
                    .map(
                        ({ id, gate }) =>
                            gate && (
                                <DetailsResourceCard
                                    key={id}
                                    label={gate.type}
                                    linkedResource={gate}
                                    navigateUrl={`tiles/${gate.id}`}
                                    unlinkUrl={`/write/${grid.id}/locks/${resource.id}/gates/${id}/unlink`}
                                />
                            ),
                    ),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/locks/${resource.id}/gates/${id}/link`
                    }
                    options={grid.gates.filter(
                        (gate) =>
                            !resource.instances.find(
                                ({ gate_id }) => gate_id === gate.id,
                            ),
                    )}
                />,
            ]}
        </Wait>
    )
}
