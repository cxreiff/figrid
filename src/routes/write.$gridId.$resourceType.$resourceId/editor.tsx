import { FileIcon, ResetIcon } from "@radix-ui/react-icons"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutTitled } from "~/components/layoutTitled.tsx"
import { Input } from "~/components/ui/input.tsx"
import { Label } from "~/components/ui/label.tsx"
import { Textarea } from "~/components/ui/textarea.tsx"
import type { ResourceType } from "~/routes/write.$gridId/route.tsx"
import { ValidatedForm } from "remix-validated-form"
import { useOutletContext } from "@remix-run/react"
import type { WriteGridQuery } from "~/routes/write.$gridId/query.server.ts"
import { formSchema } from "~/routes/write.$gridId.$resourceType.$resourceId/route.tsx"

export function Editor({ id, type }: { id?: number; type: ResourceType }) {
    const grid = useOutletContext<WriteGridQuery>()

    if (!id) {
        return <div className="text-muted">select a resource</div>
    }

    const resource = grid[type].find((tile) => tile.id === id)

    if (!resource) {
        return <div className="text-muted">select a resource</div>
    }

    return (
        <LayoutTitled
            footerSlot={
                <div className="flex">
                    <ButtonIcon icon={ResetIcon} className="mx-2">
                        revert
                    </ButtonIcon>
                    <div className="flex-1" />
                    <ButtonIcon icon={FileIcon} className="mx-2">
                        save
                    </ButtonIcon>
                </div>
            }
        >
            <ValidatedForm
                key={`${id}.${type}`}
                className="h-full"
                validator={formSchema}
                method="POST"
                action="action/write/save"
            >
                <Label className="block h-5 pl-2" htmlFor="name">
                    name
                </Label>
                <Input
                    id="name"
                    className="mb-4 h-9"
                    placeholder="name..."
                    defaultValue={resource.name}
                />
                <Label className="block h-5 pl-2" htmlFor="summary">
                    summary
                </Label>
                <Input
                    id="summary"
                    className="mb-4 h-9"
                    placeholder="summary..."
                    defaultValue={resource.summary || ""}
                />
                <Label className="block h-5 pl-2" htmlFor="description">
                    description
                </Label>
                <Textarea
                    id="description"
                    className="h-[calc(100%-10.25rem)] resize-none"
                    placeholder="description..."
                    defaultValue={resource.description || ""}
                />
            </ValidatedForm>
        </LayoutTitled>
    )
}
