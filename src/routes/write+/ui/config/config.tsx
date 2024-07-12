import { useContext } from "react"
import { LayoutSplit } from "~/ui/layout/layoutSplit.tsx"
import { ContextLayout } from "~/lib/contextLayout.ts"
import { ConfigImage } from "./configImage.tsx"
import { ConfigMain } from "./configMain.tsx"

export function Config() {
    const { configLayoutRef, initialLayout, minSizes, saveLayout } =
        useContext(ContextLayout)

    return (
        <LayoutSplit
            direction="vertical"
            layoutRef={configLayoutRef}
            initialLayout={initialLayout.details}
            minSizes={minSizes.details}
            onSaveLayout={saveLayout}
        >
            <ConfigImage />
            <ConfigMain />
        </LayoutSplit>
    )
}
