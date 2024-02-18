import { Button, type ButtonProps } from "~/ui/primitives/button.tsx"
import { cn, type IconType } from "~/lib/misc.ts"

export function ButtonWithIcon({
    children,
    className,
    variant,
    icon: Icon,
    alignIcon,
    ...props
}: Omit<ButtonProps, "asChild"> & {
    icon: IconType
    alignIcon?: "left" | "right"
}) {
    return (
        <Button
            className={cn("relative", className)}
            variant={variant}
            size={children !== undefined ? "default" : "icon"}
            {...props}
        >
            <Icon
                className={cn("h-5 w-5", {
                    "absolute": !!alignIcon,
                    "left-3": alignIcon === "left",
                    "right-3": alignIcon === "right",
                })}
            />
            {children !== undefined && (
                <span
                    className={cn({
                        "w-full": !!alignIcon,
                        "pl-2 pr-1": !alignIcon,
                        "pl-8 pr-3": alignIcon === "left",
                        "pl-3 pr-8": alignIcon === "right",
                    })}
                >
                    {children}
                </span>
            )}
        </Button>
    )
}
