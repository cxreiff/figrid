import { useContext } from "react"
import { LayoutSplit } from "~/components/layout/layoutSplit.tsx"
import { ContextLayout } from "~/lib/contextLayout.ts"
import { AssetsAudio } from "~/routes/write+/assets/assetsAudio.tsx"
import { AssetsImages } from "~/routes/write+/assets/assetsImages.tsx"

export function Assets() {
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
            <AssetsImages />
            <AssetsAudio />
        </LayoutSplit>
    )
}
