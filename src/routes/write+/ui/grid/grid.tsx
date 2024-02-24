import { Placeholder } from "~/ui/placeholder.tsx"
import { LayoutTitled } from "~/ui/layout/layoutTitled.tsx"
import { Card } from "~/ui/primitives/card.tsx"

export function Grid() {
    return (
        <Card className="h-full p-4">
            <LayoutTitled title="grid">
                <Placeholder>to be implemented</Placeholder>
            </LayoutTitled>
        </Card>
    )
}
