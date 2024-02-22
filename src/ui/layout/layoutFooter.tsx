import type { ReactNode } from "react"

export function LayoutFooter({
    children: [child1, child2],
}: {
    children: [ReactNode, ReactNode]
}) {
    return (
        <div className="flex h-full flex-col gap-3">
            <div className="min-h-0 flex-1">{child1}</div>
            <div className="flex-0">{child2}</div>
        </div>
    )
}
