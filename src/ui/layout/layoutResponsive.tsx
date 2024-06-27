import { type ReactNode, type RefObject } from "react"
import { LayoutTabs } from "./layoutTabs.tsx"
import { LayoutSplit } from "./layoutSplit.tsx"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"

export function LayoutResponsive<T extends string[], U extends number[]>({
    names,
    defaultValue = names[0],
    value,
    onValueChange,
    tabsChildren,

    layoutRef,
    initialLayout,
    minSizes,
    onSaveLayout,
    splitChildren,
}: {
    names: readonly [...T]
    defaultValue?: (typeof names)[number]
    value?: (typeof names)[number]
    onValueChange?: (value: (typeof names)[number]) => void
    tabsChildren: [...{ [I in keyof T]: ReactNode }]
    className?: string

    layoutRef: RefObject<ImperativePanelGroupHandle> | null
    initialLayout: readonly [...U]
    minSizes: readonly [...{ [I in keyof U]: number }]
    onSaveLayout: () => void
    splitChildren: [...{ [I in keyof U]: ReactNode }]
}) {
    return (
        <>
            <LayoutTabs
                className="lg:hidden"
                names={[...names]}
                defaultValue={defaultValue}
                value={value}
                onValueChange={onValueChange}
            >
                {tabsChildren}
            </LayoutTabs>
            <LayoutSplit
                className="hidden lg:block"
                direction="horizontal"
                layoutRef={layoutRef}
                initialLayout={initialLayout}
                minSizes={minSizes}
                onSaveLayout={onSaveLayout}
            >
                {splitChildren}
            </LayoutSplit>
        </>
    )
}
