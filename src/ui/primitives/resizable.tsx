import * as React from "react"
import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "~/lib/misc.ts"

const ResizablePanelGroup = React.forwardRef<
    React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
    React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelGroup>
>(({ className, ...props }, ref) => (
    <ResizablePrimitive.PanelGroup
        ref={ref}
        className={cn(
            "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
            className,
        )}
        {...props}
    />
))
ResizablePanelGroup.displayName = ResizablePrimitive.PanelGroup.displayName

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
    withHandle,
    neighborCollapsed = false,
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
    withHandle?: boolean
    neighborCollapsed?: boolean
}) => (
    <ResizablePrimitive.PanelResizeHandle
        className={cn(
            "relative flex w-px select-none items-center justify-center bg-border [-webkit-user-select:none] before:absolute before:inset-[-0.4rem] after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
            neighborCollapsed
                ? "rounded-md bg-accent hover:bg-accent-foreground data-[panel-group-direction=horizontal]:my-auto data-[panel-group-direction=vertical]:mx-auto data-[panel-group-direction=horizontal]:h-24 data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=horizontal]:w-1 data-[panel-group-direction=vertical]:w-24"
                : "bg-transparent hover:bg-muted",
            className,
        )}
        {...props}
    >
        {withHandle && (
            <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
                <DragHandleDots2Icon className="h-2.5 w-2.5" />
            </div>
        )}
    </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
