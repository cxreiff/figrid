import { Card } from "@itsmapleleaf/radix-themes"
import { StatusImage } from "~/routes/read.$gridId/status/statusImage.tsx"
import { StatusInventory } from "~/routes/read.$gridId/status/statusInventory.tsx"

export function Status() {
    return (
        <>
            <Card className="mb-4 h-1/2">
                <StatusImage />
            </Card>
            <Card className="h-[calc(50%-1rem)] pt-4">
                <div className="h-full overflow-auto px-5">
                    <StatusInventory />
                </div>
            </Card>
        </>
    )
}
