import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function Wait<T>({
    on,
    meanwhile = "",
    asChild = false,
    className = "",
    children,
}: {
    on?: T
    meanwhile?: ReactNode
    asChild?: boolean
    className?: string
    children: (awaited: T) => ReactNode
}) {
    return on === undefined ? (
        meanwhile
    ) : asChild ? (
        children(on)
    ) : (
        <div className={twMerge("duration-500 animate-in fade-in", className)}>
            {children(on)}
        </div>
    )
}
