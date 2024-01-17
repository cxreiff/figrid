import { useContext } from "react"
import { Card } from "~/components/ui/card.tsx"
import { AreaAdditional } from "~/routes/read+/area/areaAdditional.tsx"
import { AreaCharacters } from "~/routes/read+/area/areaCharacters.tsx"
import { AreaImage } from "~/routes/read+/area/areaImage.tsx"
import { AreaItems } from "~/routes/read+/area/areaItems.tsx"
import { ContextLayout } from "~/lib/contextLayout.ts"
import { LayoutVerticalSplit } from "~/components/layout/layoutVerticalSplit.tsx"

export function Area() {
    const { areaLayoutRef, initialLayout, minSizes, saveLayout } =
        useContext(ContextLayout)

    return (
        <LayoutVerticalSplit
            layoutRef={areaLayoutRef}
            initialLayout={initialLayout.area}
            minSizes={minSizes.area}
            onSaveLayout={saveLayout}
        >
            <Card className="mb-4 h-full p-4">
                <AreaImage />
            </Card>
            <Card className="h-full p-2 pt-4">
                <div className="h-full overflow-auto p-4">
                    <AreaItems />
                    <AreaCharacters />
                    <AreaAdditional />
                </div>
            </Card>
        </LayoutVerticalSplit>
    )
}
