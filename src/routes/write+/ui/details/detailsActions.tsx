import { CopyIcon, TrashIcon } from "@radix-ui/react-icons"
import { useFetcher, useNavigate } from "@remix-run/react"
import { useState } from "react"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { DeleteResourceDialog } from "~/ui/deleteResourceDialog.tsx"
import { type ResourceType } from "~/routes/write+/$gridId+/_route.tsx"

export function DetailsActions({
    resourceType,
    resourceId,
}: {
    resourceType: ResourceType
    resourceId: number
}) {
    const navigate = useNavigate()
    const fetcher = useFetcher()

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    return (
        <div className="flex gap-3">
            {resourceType !== "gates" && (
                <ButtonWithIcon
                    icon={CopyIcon}
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                        navigate(
                            `${resourceType}/create?duplicate=${resourceId}`,
                        )
                    }
                >
                    duplicate
                </ButtonWithIcon>
            )}
            <ButtonWithIcon
                icon={TrashIcon}
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteModalOpen(true)}
            >
                remove
            </ButtonWithIcon>
            <DeleteResourceDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={() =>
                    fetcher.submit(null, {
                        action: `${resourceType}/${resourceId}/delete`,
                        method: "POST",
                    })
                }
            />
        </div>
    )
}
