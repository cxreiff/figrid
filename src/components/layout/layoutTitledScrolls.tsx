import {
    LayoutTitled,
    type LayoutTitledProps,
} from "~/components/layout/layoutTitled.tsx"
import { Scroller } from "~/components/scroller.tsx"

export function LayoutTitledScrolls({ children, ...props }: LayoutTitledProps) {
    return (
        <LayoutTitled {...props}>
            <Scroller>{children}</Scroller>
        </LayoutTitled>
    )
}
