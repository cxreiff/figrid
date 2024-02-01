import type { Direction } from "node_modules/react-resizable-panels/dist/declarations/src/types.js"
import { useState, type ReactNode, type RefObject } from "react"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/ui/primitives/resizable.tsx"

export function LayoutSplit<T extends number[]>({
    children,
    direction,
    layoutRef,
    initialLayout,
    minSizes,
    onSaveLayout,
}: {
    children: [...{ [I in keyof T]: ReactNode }]
    direction: Direction
    layoutRef: RefObject<ImperativePanelGroupHandle> | null
    initialLayout: readonly [...T]
    minSizes: readonly [...{ [I in keyof T]: number }]
    onSaveLayout: () => void
}) {
    const [firstCollapsed, setFirstCollapsed] = useState(
        initialLayout[0] < minSizes[0],
    )
    const [lastCollapsed, setLastCollapsed] = useState(
        initialLayout[children.length - 1] < minSizes[children.length - 1],
    )

    return (
        <ResizablePanelGroup
            ref={layoutRef}
            direction={direction}
            className="gap-1.5"
            onLayout={onSaveLayout}
        >
            {children.flatMap((child, index) => {
                let onCollapse, onExpand, collapsible, neighborCollapsed
                if (index === 0) {
                    onCollapse = () => setFirstCollapsed(true)
                    onExpand = () => setFirstCollapsed(false)
                    collapsible = true
                } else if (index === 1) {
                    neighborCollapsed = firstCollapsed
                } else if (index === children.length - 1) {
                    onCollapse = () => setLastCollapsed(true)
                    onExpand = () => setLastCollapsed(false)
                    collapsible = true
                    neighborCollapsed = lastCollapsed
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
                        minSize={minSizes[index]}
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
