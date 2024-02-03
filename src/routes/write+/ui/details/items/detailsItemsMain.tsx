import { useSuperRouteLoaderData } from "~/lib/superjson.ts"
import type { WriteItemQuery } from "~/routes/write+/lib/queries.server.ts"
import { type loader as childLoader } from "~/routes/write+/$gridId+/$resourceType+/+$resourceId.tsx"
import { TypeSelect } from "~/ui/typeSelect.tsx"
import { useFetcher } from "@remix-run/react"

export function DetailsItemsMain() {
    const resource = useSuperRouteLoaderData<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteItemQuery

    const fetcher = useFetcher()
    const type = fetcher.formData
        ? fetcher.formData.get("type")?.toString() || resource.type
        : resource.type

    return (
        <>
            <TypeSelect
                options={[
                    { value: "basic", label: "basic" },
                    { value: "key", label: "key" },
                ]}
                selected={type}
                onSelect={(type) =>
                    fetcher.submit(
                        { type },
                        {
                            action: `items/${resource.id}/update`,
                            method: "POST",
                        },
                    )
                }
            />
        </>
    )
}
