import { useContext } from "react"
import { Card } from "~/ui/primitives/card.tsx"
import { AreaAdditional } from "~/routes/read+/ui/area/areaAdditional.tsx"
import { AreaCharacters } from "~/routes/read+/ui/area/areaCharacters.tsx"
import { AreaImage } from "~/routes/read+/ui/area/areaImage.tsx"
import { AreaItems } from "~/routes/read+/ui/area/areaItems.tsx"
import { ContextLayout } from "~/lib/contextLayout.ts"
import { LayoutSplit } from "~/ui/layout/layoutSplit.tsx"
import { Scroller } from "~/ui/scroller.tsx"

export function Area() {
    const { areaLayoutRef, initialLayout, minSizes, saveLayout } =
        useContext(ContextLayout)

    return (
        <LayoutSplit
            direction="vertical"
            layoutRef={areaLayoutRef}
            initialLayout={initialLayout.area}
            minSizes={minSizes.area}
            onSaveLayout={saveLayout}
        >
            <Card className="mb-4 h-full p-4">
                <AreaImage />
            </Card>
            <Card className="h-full px-4">
                <Scroller className="px-2 py-6">
                    <AreaItems />
                    <AreaCharacters />
                    <AreaAdditional />
                </Scroller>
            </Card>
        </LayoutSplit>
    )
}
