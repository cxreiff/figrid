import type { IconProps } from "@radix-ui/react-icons/dist/types.js"
import { Button, type ButtonProps } from "~/components/ui/button.tsx"
import { cn } from "~/lib/misc.ts"

export function ButtonIcon({
    children,
    className,
    variant = "ghost",
    icon: Icon,
    alignIcon = "left",
    ...props
}: ButtonProps & {
    icon: (props: IconProps) => React.ReactNode
    alignIcon?: "left" | "right"
}) {
    const iconAtEdge = !!children && variant !== "ghost" && variant !== "inline"

    return (
        <Button
            className={cn("relative rounded-md", className)}
            variant={variant}
            size={children ? "default" : "icon"}
            {...props}
        >
            <Icon
                className={cn({
                    "absolute": iconAtEdge,
                    "left-3": iconAtEdge && alignIcon === "left",
                    "right-3": iconAtEdge && alignIcon === "right",
                    "mr-2": !!children && !iconAtEdge && alignIcon === "left",
                    "ml-2": !!children && !iconAtEdge && alignIcon === "right",
                })}
            />
            {children && (
                <span
                    className={cn({
                        "w-full": iconAtEdge,
                        "pl-6 pr-2": iconAtEdge && alignIcon === "left",
                        "pl-2 pr-6": iconAtEdge && alignIcon === "right",
                    })}
                >
                    {children}
                </span>
            )}
        </Button>
    )
}
