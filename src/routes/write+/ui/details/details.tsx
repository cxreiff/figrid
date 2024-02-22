import { useContext } from "react"
import { ContextLayout } from "~/lib/contextLayout.ts"
import { DetailsMain } from "~/routes/write+/ui/details/detailsMain.tsx"
import { DetailsImage } from "~/routes/write+/ui/details/detailsImage.tsx"
import { LayoutSplit } from "~/ui/layout/layoutSplit.tsx"

export function Details() {
    const { detailsLayoutRef, initialLayout, minSizes, saveLayout } =
        useContext(ContextLayout)

    return (
        <LayoutSplit
            direction="vertical"
            layoutRef={detailsLayoutRef}
            initialLayout={initialLayout.details}
            minSizes={minSizes.details}
            onSaveLayout={saveLayout}
        >
            <DetailsImage />
            <DetailsMain />
        </LayoutSplit>
    )
}
