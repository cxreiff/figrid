import { useContext } from "react"
import { Card } from "~/components/ui/card.tsx"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable.tsx"
import { AreaAdditional } from "~/routes/read.$gridId/area/areaAdditional.tsx"
import { AreaCharacters } from "~/routes/read.$gridId/area/areaCharacters.tsx"
import { AreaImage } from "~/routes/read.$gridId/area/areaImage.tsx"
import { AreaItems } from "~/routes/read.$gridId/area/areaItems.tsx"
import { ContextLayout } from "~/utilities/contextLayout.ts"

export function Area() {
    const { areaLayout, saveLayout, initialLayout } = useContext(ContextLayout)

    return (
        <ResizablePanelGroup
            ref={areaLayout}
            direction="vertical"
            className="gap-2"
            onLayout={saveLayout}
        >
            <ResizablePanel minSize={20} defaultSize={initialLayout.area[0]}>
                <Card className="mb-4 h-full p-4">
                    <AreaImage />
                </Card>
            </ResizablePanel>
            <ResizableHandle className="bg-transparent hover:bg-muted" />
            <ResizablePanel minSize={20} defaultSize={initialLayout.area[1]}>
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
