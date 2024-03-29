import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/misc.ts"

const buttonVariants = cva(
    "inline-flex rounded-md cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:text-muted-foreground disabled:border-muted disabled:bg-[hsla(var(--muted)/0.2)]",
    {
        variants: {
            variant: {
                default:
                    "hover:bg-[hsla(var(--accent)/0.4)] text-accent-foreground disabled:bg-inherit",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-accent bg-transparent shadow-sm hover:bg-[hsla(var(--accent)/0.4)] text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                inline: "hover:bg-[hsla(var(--accent)/0.4)] text-accent-foreground -m-2 disabled:bg-inherit",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 p-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-10 px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    },
)
Button.displayName = "Button"

export { Button, buttonVariants }
