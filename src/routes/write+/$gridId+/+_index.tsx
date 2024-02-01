import { Card } from "~/ui/primitives/card.tsx"
import { ResourcePlaceholder } from "~/routes/write+/ui/resourcePlaceholder.tsx"

export default function Route() {
    return (
        <Card className="h-full">
            <ResourcePlaceholder>select a resource</ResourcePlaceholder>
        </Card>
    )
}
