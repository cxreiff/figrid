import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/+$resourceId.tsx"
import type { WriteGateQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"
import { DetailsResourceCheckbox } from "~/routes/write+/ui/details/detailsResourceCheckbox.tsx"
import { EyeNoneIcon, LockClosedIcon } from "@radix-ui/react-icons"
import { defined } from "~/lib/misc.ts"

export function DetailsGatesRequirements() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteGateQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.lock_instances.map(({ id, lock, inverse, hidden }) => (
                    <DetailsResourceCard
                        key={id}
                        linkedResource={lock}
                        navigateUrl={`locks/${lock.id}`}
                        unlinkUrl={`/write/${grid.id}/gates/${resource.id}/requirements/${id}/unlink`}
                        indicatorIcons={[
                            inverse ? LockClosedIcon : undefined,
                            hidden ? EyeNoneIcon : undefined,
                        ].filter(defined)}
                    >
                        <DetailsResourceCheckbox
                            field="inverse"
                            checked={inverse}
                            updateRoute={`/write/${grid.id}/lock_instances/${id}/update`}
                            label={"inverse"}
                            description="satisfied when the associated lock is locked"
                        />
                        <DetailsResourceCheckbox
                            field="hidden"
                            checked={hidden}
                            updateRoute={`/write/${grid.id}/lock_instances/${id}/update`}
                            label={"hidden"}
                            description="hidden when the requirement is not met"
                        />
                    </DetailsResourceCard>
                )),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/gates/${resource.id}/requirements/${id}/link`
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
