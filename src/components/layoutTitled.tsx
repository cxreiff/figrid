import type { PropsWithChildren, ReactNode } from "react"

export type LayoutTitledProps = PropsWithChildren<{
    title: string
    actionSlot?: ReactNode
    subheadSlot?: ReactNode
}>

export function LayoutTitled({
    title,
    actionSlot,
    subheadSlot,
    children,
}: LayoutTitledProps) {
    return (
        <div className="flex h-full flex-col">
            <div className="mb-2 flex min-h-9 items-center text-zinc-500">
                <h3 className="flex-1 pl-2">{title}</h3>
                {actionSlot}
            </div>
            {subheadSlot && <div className="mb-4">{subheadSlot}</div>}
            <div className="min-h-0 flex-1">{children}</div>
        </div>
    )
}
