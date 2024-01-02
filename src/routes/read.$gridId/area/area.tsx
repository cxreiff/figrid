import { Card } from "~/components/ui/card.tsx"
import { AreaAdditional } from "~/routes/read.$gridId/area/areaAdditional.tsx"
import { AreaCharacters } from "~/routes/read.$gridId/area/areaCharacters.tsx"
import { AreaImage } from "~/routes/read.$gridId/area/areaImage.tsx"
import { AreaItems } from "~/routes/read.$gridId/area/areaItems.tsx"

export function Area() {
    return (
        <>
            <Card className="mb-4 h-1/2 p-4">
                <AreaImage />
            </Card>
            <Card className="h-[calc(50%-1rem)] p-2 pt-4">
                <div className="h-full overflow-auto p-4">
                    <AreaItems />
                    <AreaCharacters />
                    <AreaAdditional />
                </div>
            </Card>
        </>
    )
}
