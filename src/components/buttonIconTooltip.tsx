import type { IconProps } from "@radix-ui/react-icons/dist/types.js"
import { type ButtonProps } from "~/components/ui/button.tsx"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip.tsx"

export function ButtonIconTooltip({
    tooltip,
    icon: Icon,
    ...props
}: Omit<ButtonProps, "children"> & {
    tooltip: string
    icon: (props: IconProps) => React.ReactNode
}) {
    return (
        <Tooltip>
            <TooltipTrigger variant="ghost" size="icon" {...props}>
                <Icon />
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    )
}
