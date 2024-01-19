import type { HTMLProps, PropsWithChildren } from "react"
import { cn } from "~/lib/misc.ts"

export function Scroller({
    children,
    className,
}: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
    return (
        <div
            className={cn(
                "scroll-shadows -mx-4 overflow-auto rounded-md px-4",
                "focus-visible:outline-none focus-visible:ring-inset",
                "focus-visible:ring-1 focus-visible:ring-ring",
                className,
            )}
        >
            {children}
        </div>
    )
}
