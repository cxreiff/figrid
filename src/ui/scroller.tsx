import { forwardRef, type HTMLProps, type PropsWithChildren } from "react"
import { cn } from "~/lib/misc.ts"

export const Scroller = forwardRef<
    HTMLDivElement,
    PropsWithChildren<HTMLProps<HTMLDivElement>>
>(({ children, className, ...props }, ref) => (
    <div className="h-full px-0.5">
        <div
            ref={ref}
            className={
                "-mx-4 h-full overflow-auto rounded-md px-3.5 " +
                "focus-visible:outline-none focus-visible:ring-inset " +
                "focus-visible:ring-1 focus-visible:ring-ring"
            }
        >
            <div className={cn("pb-2", className)} {...props}>
                {children}
            </div>
        </div>
    </div>
))
Scroller.displayName = "Scroller"
