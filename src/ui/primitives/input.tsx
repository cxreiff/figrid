import * as React from "react"

import { cn, type IconType } from "~/lib/misc.ts"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-auto disabled:opacity-50",
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
    icon: IconType
}

const InputWithIcon = React.forwardRef<HTMLInputElement, IconInputProps>(
    ({ icon: Icon, className, ...props }, ref) => {
        return (
            <span className={cn("relative block h-9 rounded-md", className)}>
                <Icon className="absolute inset-y-0 left-3 h-full w-5 px-0.5" />
                <Input ref={ref} className={"h-full pl-10"} {...props} />
            </span>
        )
    },
)
InputWithIcon.displayName = "IconInput"

export { Input, InputWithIcon }
