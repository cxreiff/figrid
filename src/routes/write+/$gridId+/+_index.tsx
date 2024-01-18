import { Card } from "~/components/ui/card.tsx"
import { ResourcePlaceholder } from "~/routes/write+/resourcePlaceholder.tsx"

export default function Route() {
    return (
        <Card className="h-full">
            <ResourcePlaceholder>select a resource</ResourcePlaceholder>
        </Card>
    )
}
