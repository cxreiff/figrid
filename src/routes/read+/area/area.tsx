import { useContext, useState } from "react"
import { Card } from "~/components/ui/card.tsx"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable.tsx"
import { AreaAdditional } from "~/routes/read+/area/areaAdditional.tsx"
import { AreaCharacters } from "~/routes/read+/area/areaCharacters.tsx"
import { AreaImage } from "~/routes/read+/area/areaImage.tsx"
import { AreaItems } from "~/routes/read+/area/areaItems.tsx"
import { ContextLayout } from "~/lib/contextLayout.ts"

export function Area() {
    const {
        areaLayoutRef: areaLayout,
        saveLayout,
        initialLayout,
    } = useContext(ContextLayout)
    const [topCollapsed, setTopCollapsed] = useState(initialLayout.area[0] < 20)
    const [bottomCollapsed, setBottomCollapsed] = useState(
        initialLayout.area[1] < 20,
    )

    return (
        <ResizablePanelGroup
            ref={areaLayout}
            direction="vertical"
            className="gap-2"
            onLayout={saveLayout}
        >
            <ResizablePanel
                minSize={20}
                defaultSize={initialLayout.area[0]}
                onCollapse={() => setTopCollapsed(true)}
                onExpand={() => setTopCollapsed(false)}
                collapsible
            >
                <Card className="mb-4 h-full p-4">
                    <AreaImage />
                </Card>
            </ResizablePanel>
            <ResizableHandle
                neighborCollapsed={topCollapsed || bottomCollapsed}
            />
            <ResizablePanel
                minSize={20}
                defaultSize={initialLayout.area[1]}
                onCollapse={() => setBottomCollapsed(true)}
                onExpand={() => setBottomCollapsed(false)}
                collapsible
            >
                <Card className="h-full p-2 pt-4">
                    <div className="h-full overflow-auto p-4">
                        <AreaItems />
                        <AreaCharacters />
                        <AreaAdditional />
                    </div>
                </Card>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
