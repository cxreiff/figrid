import type { PropsWithChildren, ReactNode } from "react"

export type LayoutTitledProps = PropsWithChildren<{
    title?: string
    actionSlot?: ReactNode
    subheaderSlot?: ReactNode
    footerSlot?: ReactNode
}>

export function LayoutTitled({
    title,
    actionSlot,
    subheaderSlot,
    footerSlot,
    children,
}: LayoutTitledProps) {
    return (
        <div className="flex h-full flex-col">
            {(title || actionSlot) && (
                <div className="mb-2 flex min-h-9 items-center text-zinc-500">
                    <h3 className="flex-1 pl-2">{title}</h3>
                    {actionSlot}
                </div>
            )}
            {subheaderSlot && <div className="mb-4">{subheaderSlot}</div>}
            <div className="min-h-0 flex-1">{children}</div>
            {footerSlot && <div className="mt-4">{footerSlot}</div>}
        </div>
    )
}
