import { useState, type ReactNode, type RefObject } from "react"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable.tsx"

export function LayoutVerticalSplit<T extends number[]>({
    children,
    layoutRef,
    initialLayout,
    minSizes,
    onSaveLayout,
}: {
    children: [...{ [I in keyof T]: ReactNode }]
    layoutRef: RefObject<ImperativePanelGroupHandle> | null
    initialLayout: readonly [...T]
    minSizes?: readonly [...{ [I in keyof T]: number }]
    onSaveLayout: () => void
}) {
    const [topCollapsed, setTopCollapsed] = useState(initialLayout[0] < 20)
    const [bottomCollapsed, setBottomCollapsed] = useState(
        initialLayout[1] < 20,
    )

    return (
        <ResizablePanelGroup
            ref={layoutRef}
            direction="vertical"
            className="gap-2"
            onLayout={onSaveLayout}
        >
            {children.flatMap((child, index) => {
                let onCollapse, onExpand, collapsible, neighborCollapsed
                if (index === 0) {
                    onCollapse = () => setTopCollapsed(true)
                    onExpand = () => setTopCollapsed(false)
                    collapsible = true
                } else if (index === 1) {
                    neighborCollapsed = topCollapsed
                } else if (index === children.length - 1) {
                    onCollapse = () => setBottomCollapsed(true)
                    onExpand = () => setBottomCollapsed(false)
                    collapsible = true
                    neighborCollapsed = bottomCollapsed
                }

                return [
                    index !== 0 && (
                        <ResizableHandle
                            key={`${index}.handle`}
                            neighborCollapsed={neighborCollapsed}
                        />
                    ),
                    <ResizablePanel
                        key={index}
                        minSize={minSizes?.[index] || 20}
                        defaultSize={initialLayout[index]}
                        onCollapse={onCollapse}
                        onExpand={onExpand}
                        collapsible={collapsible}
                    >
                        {child}
                    </ResizablePanel>,
                ]
            })}
        </ResizablePanelGroup>
    )
}
