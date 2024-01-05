import {
    ArrowLeftIcon,
    ArrowRightIcon,
    FileIcon,
    ResetIcon,
} from "@radix-ui/react-icons"
import { ButtonIconTooltip } from "~/components/buttonIconTooltip.tsx"
import { LayoutTitled } from "~/components/layoutTitled.tsx"
import { Card } from "~/components/ui/card.tsx"
import { Textarea } from "~/components/ui/textarea.tsx"
import type { SelectedResource, loader } from "~/routes/write.$gridId/route.tsx"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

export function Editor({ selected }: { selected: SelectedResource }) {
    const { grid } = useSuperLoaderData<typeof loader>()

    const resource = grid.tiles.find((tile) => tile.id === selected?.id)

    return (
        <Card className="h-full p-4">
            {resource ? (
                <LayoutTitled
                    title={
                        grid.tiles.find((tile) => tile.id === selected?.id)
                            ?.name || ""
                    }
                    actionSlot={
                        <>
                            <ButtonIconTooltip
                                icon={ResetIcon}
                                tooltip="revert"
                            />
                            <ButtonIconTooltip
                                icon={ArrowLeftIcon}
                                tooltip="undo"
                            />
                            <ButtonIconTooltip
                                icon={ArrowRightIcon}
                                tooltip="redo"
                            />
                            <ButtonIconTooltip icon={FileIcon} tooltip="save" />
                        </>
                    }
                >
                    <Textarea
                        className="h-full resize-none"
                        placeholder="description..."
                        defaultValue={resource.description || ""}
                    />
                </LayoutTitled>
            ) : (
                <div className="text-muted">select a resource</div>
            )}
        </Card>
    )
}
