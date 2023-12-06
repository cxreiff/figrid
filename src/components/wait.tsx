import type { ReactNode } from "react"

export function Wait<T>({
    on,
    meanwhile = "",
    asChild = false,
    children,
}: {
    on?: T
    meanwhile?: ReactNode
    asChild?: boolean
    children: (awaited: T) => ReactNode
}) {
    return on === undefined ? (
        meanwhile
    ) : asChild ? (
        children(on)
    ) : (
        <div className="h-full w-full duration-500 animate-in fade-in">
            {children(on)}
        </div>
    )
}
