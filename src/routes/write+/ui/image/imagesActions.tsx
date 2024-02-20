import type { loader } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { Form, useParams } from "@remix-run/react"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Scroller } from "~/ui/scroller.tsx"
import { Card } from "~/ui/primitives/card.tsx"
import { useSuperRouteLoaderData } from "~/lib/superjson.ts"
import type {
    WriteCharacterQuery,
    WriteEventQuery,
    WriteGridQuery,
    WriteItemQuery,
    WriteTileQuery,
} from "~/routes/write+/lib/queries.server.ts"
import { ResourcePlaceholder } from "~/routes/write+/ui/resourcePlaceholder.tsx"

export function ImagesActions() {
    const { resourceType } = paramsSchema.partial().parse(useParams())
    const resource = useSuperRouteLoaderData<typeof loader>(
        "routes/write+/$gridId+/$resourceType+/$resourceId+/_index",
    )?.resource as
        | WriteTileQuery
        | WriteEventQuery
        | WriteCharacterQuery
        | WriteGridQuery
        | WriteItemQuery
        | undefined

    return (
        <Card className="h-full p-4">
            <Scroller className="flex min-h-full items-center justify-center">
                {(function () {
                    if (!resource || !resourceType) {
                        return (
                            <ResourcePlaceholder>
                                select a resource
                            </ResourcePlaceholder>
                        )
                    }

                    if (!resource.image_asset_id) {
                        return (
                            <ResourcePlaceholder>
                                no actions
                            </ResourcePlaceholder>
                        )
                    }

                    return (
                        <Form
                            action={`${resourceType}/${resource.id}/assets/images/${resource.image_asset_id}/delete`}
                            navigate={false}
                            method="POST"
                        >
                            <ButtonWithIcon
                                icon={Cross2Icon}
                                type="submit"
                                variant="outline"
                                className="w-full"
                                disabled={!resource.image_asset_id}
                            >
                                remove image
                            </ButtonWithIcon>
                        </Form>
                    )
                })()}
            </Scroller>
        </Card>
    )
}
