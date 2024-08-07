import { Wait } from "~/ui/wait.tsx"
import { useSuperLoaderData, useSuperRouteLoaderData } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/$gridId+/_route.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import type { WriteLockQuery } from "~/routes/write+/lib/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/ui/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/ui/details/detailsResourceLinker.tsx"
import { LabeledCheckbox } from "~/ui/labeledCheckbox.tsx"
import { useFetcher } from "@remix-run/react"

export function DetailsLocksItem() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_index",
    )?.resource as WriteLockQuery

    const fetcher = useFetcher()
    const consumes = fetcher.formData
        ? fetcher.formData.get("consumes") === "true"
        : resource.consumes

    return (
        <Wait on={resource}>
            {(resource) =>
                resource.required_item ? (
                    <>
                        <DetailsResourceCard
                            label={resource.required_item.type}
                            linkedResource={resource.required_item}
                            navigateUrl={`items/${resource.required_item_id}`}
                            unlinkUrl={`/write/${grid.id}/locks/${resource.id}/item/${resource.required_item_id}/unlink`}
                        />
                        {resource.required_item_id !== null && (
                            <LabeledCheckbox
                                className="px-5 py-3"
                                label="consumes item"
                                description="unlocking this lock with an item will consume the item."
                                id="consumes"
                                checked={consumes}
                                onCheckedChange={(checked) => {
                                    fetcher.submit(
                                        { consumes: checked === true },
                                        {
                                            action: `/write/${grid.id}/locks/${resource.id}/update`,
                                            method: "POST",
                                        },
                                    )
                                }}
                            />
                        )}
                    </>
                ) : (
                    <DetailsResourceLinker
                        key="link"
                        getLinkUrl={(id) =>
                            `/write/${grid.id}/locks/${resource.id}/item/${id}/link`
                        }
                        options={grid.items}
                    />
                )
            }
        </Wait>
    )
}
