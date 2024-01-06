import type { IconProps } from "@radix-ui/react-icons/dist/types.js"
import { Button, type ButtonProps } from "~/components/ui/button.tsx"

export function ButtonIcon({
    children,
    icon: Icon,
    ...props
}: ButtonProps & {
    icon: (props: IconProps) => React.ReactNode
}) {
    return (
        <Button
            className="rounded-md"
            variant="ghost"
            size={children ? "default" : "icon"}
            {...props}
        >
            {children}
            <Icon className={children ? "ml-1" : undefined} />
        </Button>
    )
}
