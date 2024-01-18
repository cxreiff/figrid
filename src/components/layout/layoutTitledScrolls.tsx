import {
    LayoutTitled,
    type LayoutTitledProps,
} from "~/components/layout/layoutTitled.tsx"
import { ScrollArea } from "~/components/ui/scroll-area.tsx"

export function LayoutTitledScrolls({ children, ...props }: LayoutTitledProps) {
    return (
        <LayoutTitled {...props}>
            <ScrollArea className="-mr-3 h-full pr-3">{children}</ScrollArea>
        </LayoutTitled>
    )
}
