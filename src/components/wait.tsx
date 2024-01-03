import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function Wait<T>({
    on,
    meanwhile = "",
    className = "",
    children,
}: {
    on?: T
    meanwhile?: ReactNode
    className?: string
    children: (awaited: T) => ReactNode
}) {
    return (
        <div
            className={twMerge(
                `transition-opacity duration-300 ${
                    on === undefined ? "opacity-0" : "opacity-100"
                }`,
                className,
            )}
        >
            {on === undefined ? meanwhile : children(on)}
        </div>
    )
}
