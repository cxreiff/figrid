import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import React from "react"
import { cn } from "~/lib/misc.ts"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
    React.ComponentPropsWithoutRef<
        typeof CollapsiblePrimitive.CollapsibleTrigger
    >
>(({ className, children, ...props }, ref) => (
    <CollapsiblePrimitive.CollapsibleTrigger
        ref={ref}
        className={cn(
            "flex w-full items-center p-2 [&[data-state=open]>svg]:rotate-180",
            className,
        )}
        {...props}
    >
        <div className="flex-1 text-left">{children}</div>
        <ChevronDownIcon className="text-muted-foreground transition-transform" />
    </CollapsiblePrimitive.CollapsibleTrigger>
))
CollapsibleTrigger.displayName =
    CollapsiblePrimitive.CollapsibleTrigger.displayName

const CollapsibleContent = React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <CollapsiblePrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
            className,
        )}
        {...props}
    >
        <div className="p-2">{children}</div>
    </CollapsiblePrimitive.Content>
))
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
