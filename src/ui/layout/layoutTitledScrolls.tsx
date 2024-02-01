import {
    LayoutTitled,
    type LayoutTitledProps,
} from "~/ui/layout/layoutTitled.tsx"
import { Scroller } from "~/ui/scroller.tsx"

export function LayoutTitledScrolls({ children, ...props }: LayoutTitledProps) {
    return (
        <LayoutTitled {...props}>
            <Scroller>{children}</Scroller>
        </LayoutTitled>
    )
}
