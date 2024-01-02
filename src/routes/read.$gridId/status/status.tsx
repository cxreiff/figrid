import { useContext } from "react"
import { Card } from "~/components/ui/card.tsx"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable.tsx"
import { StatusImage } from "~/routes/read.$gridId/status/statusImage.tsx"
import { StatusInventory } from "~/routes/read.$gridId/status/statusInventory.tsx"
import {
    ContextLayout,
    DEFAULT_LAYOUT_STATUS,
} from "~/utilities/contextLayout.ts"

export function Status() {
    const { areaLayout } = useContext(ContextLayout)

    return (
        <ResizablePanelGroup
            ref={areaLayout}
            direction="vertical"
            className="gap-2"
        >
            <ResizablePanel minSize={20} defaultSize={DEFAULT_LAYOUT_STATUS[0]}>
                <Card className="mb-4 h-full p-4">
                    <StatusImage />
                </Card>
            </ResizablePanel>
            <ResizableHandle className="bg-transparent" />
            <ResizablePanel minSize={20} defaultSize={DEFAULT_LAYOUT_STATUS[1]}>
                <Card className="h-full p-2 pt-4">
                    <div className="h-full overflow-auto p-4">
                        <StatusInventory />
                    </div>
                </Card>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
