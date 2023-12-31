import * as React from "react"

import { cn } from "~/utilities/misc.ts"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                ref={ref}
                {...props}
            />
        )
    },
)
Input.displayName = "Input"

export interface IconInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: ({ className }: { className: string }) => React.ReactNode
}

const IconInput = React.forwardRef<HTMLSpanElement, IconInputProps>(
    ({ icon: Icon, className, ...props }, ref) => {
        return (
            <span className={cn("relative", className)}>
                <Icon className="absolute left-3 h-full" />
                <Input className={"pl-10"} {...props} />
            </span>
        )
    },
)
IconInput.displayName = "IconInput"

export { Input, IconInput }
