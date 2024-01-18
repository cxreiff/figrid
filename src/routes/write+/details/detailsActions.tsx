import { CopyIcon, TrashIcon } from "@radix-ui/react-icons"
import { useFetcher, useNavigate } from "@remix-run/react"
import { useState } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { DeleteResourceDialog } from "~/components/deleteResourceDialog.tsx"
import { type ResourceType } from "~/routes/write+/+$gridId.tsx"

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
                <ButtonIcon
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
                </ButtonIcon>
            )}
            <ButtonIcon
                icon={TrashIcon}
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteModalOpen(true)}
            >
                remove
            </ButtonIcon>
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
