import type { IconProps } from "@radix-ui/react-icons/dist/types.js"
import { Button, type ButtonProps } from "~/components/ui/button.tsx"
import { cn } from "~/lib/misc.ts"

export function ButtonIcon({
    children,
    className,
    variant = "ghost",
    icon: Icon,
    ...props
}: ButtonProps & {
    icon: (props: IconProps) => React.ReactNode
}) {
    const iconLeft = !!children && variant !== "ghost" && variant !== "inline"

    return (
        <Button
            className={cn("relative rounded-md", className)}
            variant={variant}
            size={children ? "default" : "icon"}
            {...props}
        >
            <Icon
                className={cn({
                    "absolute left-3": iconLeft,
                    "mr-2": !!children && !iconLeft,
                })}
            />
            {children && (
                <span
                    className={cn({
                        "w-full px-10": iconLeft,
                    })}
                >
                    {children}
                </span>
            )}
        </Button>
    )
}
