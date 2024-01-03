import { useContext, useState } from "react"
import { Card } from "~/components/ui/card.tsx"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable.tsx"
import { StatusImage } from "~/routes/read.$gridId/status/statusImage.tsx"
import { StatusInventory } from "~/routes/read.$gridId/status/statusInventory.tsx"
import { ContextLayout } from "~/utilities/contextLayout.ts"

export function Status() {
    const { statusLayout, saveLayout, initialLayout } =
        useContext(ContextLayout)
    const [topCollapsed, setTopCollapsed] = useState(
        initialLayout.status[0] < 20,
    )
    const [bottomCollapsed, setBottomCollapsed] = useState(
        initialLayout.status[1] < 20,
    )

    return (
        <ResizablePanelGroup
            ref={statusLayout}
            direction="vertical"
            className="gap-2"
            onLayout={saveLayout}
        >
            <ResizablePanel
                minSize={20}
                defaultSize={initialLayout.status[0]}
                onCollapse={() => setTopCollapsed(true)}
                onExpand={() => setTopCollapsed(false)}
                collapsible
            >
                <Card className="mb-4 h-full p-4">
                    <StatusImage />
                </Card>
            </ResizablePanel>
            <ResizableHandle
                neighborCollapsed={topCollapsed || bottomCollapsed}
            />
            <ResizablePanel
                minSize={20}
                defaultSize={initialLayout.status[1]}
                onCollapse={() => setBottomCollapsed(true)}
                onExpand={() => setBottomCollapsed(false)}
                collapsible
            >
                <Card className="h-full p-2 pt-4">
                    <div className="h-full overflow-auto p-4">
                        <StatusInventory />
                    </div>
                </Card>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
