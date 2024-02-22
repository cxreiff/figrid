import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { Form, useParams } from "@remix-run/react"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { TrashIcon } from "@radix-ui/react-icons"

export function DetailsImageRemove({
    resourceId,
    imageAssetId,
}: {
    resourceId: number
    imageAssetId: number
}) {
    const { resourceType } = paramsSchema.parse(useParams())

    return (
        <Form
            action={`${resourceType}/${resourceId}/assets/images/${imageAssetId}/delete`}
            navigate={false}
            method="POST"
        >
            <ButtonWithIcon
                icon={TrashIcon}
                type="submit"
                className="bg-card hover:bg-accent"
            />
        </Form>
    )
}
