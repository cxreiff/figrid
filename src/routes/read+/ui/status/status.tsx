import { useContext } from "react"
import { Card } from "~/ui/primitives/card.tsx"
import { StatusImage } from "~/routes/read+/ui/status/statusImage.tsx"
import { StatusInventory } from "~/routes/read+/ui/status/statusInventory.tsx"
import { ContextLayout } from "~/lib/contextLayout.ts"
import { LayoutSplit } from "~/ui/layout/layoutSplit.tsx"
import { Scroller } from "~/ui/scroller.tsx"

export function Status() {
    const { statusLayoutRef, initialLayout, minSizes, saveLayout } =
        useContext(ContextLayout)

    return (
        <LayoutSplit
            direction="vertical"
            layoutRef={statusLayoutRef}
            initialLayout={initialLayout.status}
            minSizes={minSizes.status}
            onSaveLayout={saveLayout}
        >
            <Card className="mb-4 h-full py-4">
                <StatusImage />
            </Card>
            <Card className="h-full px-4">
                <Scroller className="px-2 py-6">
                    <StatusInventory />
                </Scroller>
            </Card>
        </LayoutSplit>
    )
}
