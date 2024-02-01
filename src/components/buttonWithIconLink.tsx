import { Link, type LinkProps } from "@remix-run/react"
import { Button, type ButtonProps } from "~/components/ui/button.tsx"
import { cn, type IconType } from "~/lib/misc.ts"

export function ButtonWithIconLink({
    children,
    className,
    icon: Icon,
    alignIcon = "left",
    to,
    ...props
}: Omit<ButtonProps, "asChild"> & {
    to: LinkProps["to"]
    icon: IconType
    alignIcon?: "left" | "right"
}) {
    return (
        <Button
            className={cn("relative", className)}
            size={children ? "default" : "icon"}
            {...props}
            asChild
        >
            <Link to={to}>
                <Icon
                    className={cn("h-5 w-5", {
                        "order-1 mr-2": !!children && alignIcon === "left",
                        "order-2 ml-2": !!children && alignIcon === "right",
                    })}
                />
                {children && (
                    <span
                        className={cn({
                            "order-1 pl-2": alignIcon === "right",
                            "order-2 pr-2": alignIcon === "left",
                        })}
                    >
                        {children}
                    </span>
                )}
            </Link>
        </Button>
    )
}
