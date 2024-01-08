import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons"
import { useParams } from "@remix-run/react"
import { useEffect, useState } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutTitledScrolls } from "~/components/layoutTitledScrolls.tsx"
import { Card } from "~/components/ui/card.tsx"
import { paramsSchema } from "~/routes/write+/+$gridId.$resourceType.$resourceId.tsx"
import { DetailsCharacters } from "~/routes/write+/details/detailsCharacters.tsx"
import { DetailsEvents } from "~/routes/write+/details/detailsEvents.tsx"
import { DetailsItems } from "~/routes/write+/details/detailsItems.tsx"
import { DetailsTiles } from "~/routes/write+/details/detailsTiles.tsx"

const ACCORDION_KEYS = ["gates", "characters", "items", "events"]

export function Details() {
    const [expanded, setExpanded] = useState<string[]>([])
    const { resourceType } = paramsSchema.partial().parse(useParams())

    useEffect(() => {
        setExpanded([])
    }, [resourceType])

    return (
        <Card className="h-full p-4 pb-0">
            {resourceType && (
                <LayoutTitledScrolls
                    title="details"
                    actionSlot={
                        <>
                            <ButtonIcon
                                icon={DoubleArrowUpIcon}
                                onClick={() => setExpanded([])}
                            />
                            <ButtonIcon
                                icon={DoubleArrowDownIcon}
                                onClick={() => setExpanded(ACCORDION_KEYS)}
                            />
                        </>
                    }
                >
                    {
                        {
                            tiles: (
                                <DetailsTiles
                                    expanded={expanded}
                                    setExpanded={setExpanded}
                                />
                            ),
                            characters: (
                                <DetailsCharacters
                                    expanded={expanded}
                                    setExpanded={setExpanded}
                                />
                            ),
                            items: (
                                <DetailsItems
                                    expanded={expanded}
                                    setExpanded={setExpanded}
                                />
                            ),
                            events: (
                                <DetailsEvents
                                    expanded={expanded}
                                    setExpanded={setExpanded}
                                />
                            ),
                        }[resourceType]
                    }
                </LayoutTitledScrolls>
            )}
        </Card>
    )
}
