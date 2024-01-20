import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteEventQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/details/detailsResourceLinker.tsx"
import { useFetcher } from "@remix-run/react"
import { LabeledCheckbox } from "~/components/labeledCheckbox.tsx"

export function DetailsEventsRequirements() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteEventQuery

    const fetcher = useFetcher()

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.lock_instances.map(
                    ({ id, lock, inverse, visible }) => {
                        const optimisticInverse =
                            fetcher.formData && fetcher.formData.get("inverse")
                                ? fetcher.formData.get("inverse") === "true"
                                : inverse
                        const optimisticVisible =
                            fetcher.formData && fetcher.formData.get("visible")
                                ? fetcher.formData.get("visible") === "true"
                                : visible

                        return (
                            <>
                                <DetailsResourceCard
                                    key={id}
                                    linkedResource={lock}
                                    navigateUrl={`locks/${lock.id}`}
                                    unlinkUrl={`/write/${grid.id}/events/${resource.id}/requirements/${id}/unlink`}
                                >
                                    <LabeledCheckbox
                                        id="inverse"
                                        className="px-5 py-3"
                                        label="inverse"
                                        description="satisfied when the associated lock is locked"
                                        checked={optimisticInverse}
                                        onCheckedChange={(checked) => {
                                            fetcher.submit(
                                                {
                                                    inverse: checked === true,
                                                },
                                                {
                                                    action: `/write/${grid.id}/lock_instances/${id}/update`,
                                                    method: "POST",
                                                    navigate: true,
                                                },
                                            )
                                        }}
                                    />
                                    <LabeledCheckbox
                                        id="visible"
                                        className="px-5 py-3"
                                        label="visible"
                                        description="visible when the requirement is not met"
                                        checked={optimisticVisible}
                                        onCheckedChange={(checked) => {
                                            fetcher.submit(
                                                {
                                                    visible: checked === true,
                                                },
                                                {
                                                    action: `/write/${grid.id}/lock_instances/${id}/update`,
                                                    method: "POST",
                                                    navigate: true,
                                                },
                                            )
                                        }}
                                    />
                                </DetailsResourceCard>
                            </>
                        )
                    },
                ),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/events/${resource.id}/requirements/${id}/link`
                    }
                    options={grid.locks.filter(
                        ({ instances }) =>
                            !instances.find(
                                ({ gate_id }) => resource.id === gate_id,
                            ),
                    )}
                />,
            ]}
        </Wait>
    )
}
