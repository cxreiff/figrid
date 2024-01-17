import { useContext } from "react"
import { Card } from "~/components/ui/card.tsx"
import { StatusImage } from "~/routes/read+/status/statusImage.tsx"
import { StatusInventory } from "~/routes/read+/status/statusInventory.tsx"
import { ContextLayout } from "~/lib/contextLayout.ts"
import { LayoutVerticalSplit } from "~/components/layout/layoutVerticalSplit.tsx"

export function Status() {
    const { statusLayoutRef, initialLayout, minSizes, saveLayout } =
        useContext(ContextLayout)

    return (
        <LayoutVerticalSplit
            layoutRef={statusLayoutRef}
            initialLayout={initialLayout.status}
            minSizes={minSizes.status}
            onSaveLayout={saveLayout}
        >
            <Card className="mb-4 h-full p-4">
                <StatusImage />
            </Card>
            <Card className="h-full p-2 pt-4">
                <div className="h-full overflow-auto p-4">
                    <StatusInventory />
                </div>
            </Card>
        </LayoutVerticalSplit>
    )
}
