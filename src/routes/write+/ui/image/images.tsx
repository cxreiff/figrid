import { useContext } from "react"
import { LayoutSplit } from "~/components/layout/layoutSplit.tsx"
import { ContextLayout } from "~/lib/contextLayout.ts"
import { ImagesPicker } from "~/routes/write+/ui/image/imagesPicker.tsx"
import { ImagesDisplay } from "~/routes/write+/ui/image/imagesDisplay.tsx"

export function Images() {
    const { assetsLayoutRef, initialLayout, minSizes, saveLayout } =
        useContext(ContextLayout)

    return (
        <LayoutSplit
            direction="vertical"
            layoutRef={assetsLayoutRef}
            initialLayout={initialLayout.assets}
            minSizes={minSizes.assets}
            onSaveLayout={saveLayout}
        >
            <ImagesDisplay />
            <ImagesPicker />
        </LayoutSplit>
    )
}
