import { Button, type ButtonProps } from "~/ui/primitives/button.tsx"
import { cn, type IconType } from "~/lib/misc.ts"
import { forwardRef, type ElementRef } from "react"

export const ButtonWithIcon = forwardRef<
    ElementRef<typeof Button>,
    Omit<ButtonProps, "asChild" | "ref"> & {
        icon: IconType
        alignIcon?: "left" | "right"
    }
>(({ children, className, variant, icon: Icon, alignIcon, ...props }, ref) => {
    return (
        <Button
            ref={ref}
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
})

ButtonWithIcon.displayName = "ButtonWithIcon"
