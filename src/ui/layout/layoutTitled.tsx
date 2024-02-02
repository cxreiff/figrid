import type { PropsWithChildren, ReactNode } from "react"
import { cn } from "~/lib/misc.ts"

export type LayoutTitledProps = PropsWithChildren<{
    className?: string
    title?: string
    actionSlot?: ReactNode
    subheaderSlot?: ReactNode
    footerSlot?: ReactNode
}>

export function LayoutTitled({
    className,
    title,
    actionSlot,
    subheaderSlot,
    footerSlot,
    children,
}: LayoutTitledProps) {
    return (
        <div className={cn("flex h-full flex-col", className)}>
            {(title || actionSlot) && (
                <div className="mb-2 flex min-h-9 items-center text-zinc-500">
                    <h3 className="flex-1 pl-2">{title}</h3>
                    {actionSlot}
                </div>
            )}
            {subheaderSlot && <div className="mb-3">{subheaderSlot}</div>}
            <section className="min-h-0 flex-1">{children}</section>
            {footerSlot && <div className="mt-4">{footerSlot}</div>}
        </div>
    )
}
