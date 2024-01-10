import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons"
import { useParams } from "@remix-run/react"
import { useEffect, useMemo, useState } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutAccordion } from "~/components/layoutAccordion.tsx"
import { LayoutTitledScrolls } from "~/components/layoutTitledScrolls.tsx"
import { Card } from "~/components/ui/card.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { DetailsCharactersEvents } from "~/routes/write+/details/detailsCharactersEvents.tsx"
import { DetailsCharactersTiles } from "~/routes/write+/details/detailsCharactersTiles.tsx"
import { DetailsTilesCharacters } from "~/routes/write+/details/detailsTilesCharacters.tsx"
import { DetailsTilesEvents } from "~/routes/write+/details/detailsTilesEvents.tsx"
import { DetailsTilesGates } from "~/routes/write+/details/detailsTilesGates.tsx"
import { DetailsTilesItems } from "~/routes/write+/details/detailsTilesItems.tsx"

export function Details() {
    const [expanded, setExpanded] = useState<string[]>([])
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())

    const ACCORDION_SECTIONS = useMemo(
        () => ({
            tiles: {
                gates: <DetailsTilesGates />,
                characters: <DetailsTilesCharacters />,
                items: <DetailsTilesItems />,
                events: <DetailsTilesEvents />,
            },
            characters: {
                tiles: <DetailsCharactersTiles />,
                events: <DetailsCharactersEvents />,
            },
            items: {
                tiles: "list of item instances in tiles",
                events: "list of item instances in events",
            },
            events: {
                parent: "parent can be character, tile, or event with trigger",
                children: "list of child events",
                locks: "list of locks that are locked or unlocked by event",
                items: "list of items that are granted by event",
                requirements: "list of requirements to trigger event",
            },
        }),
        [],
    )

    useEffect(() => {
        setExpanded([])
    }, [])

    return (
        <Card className="h-full p-4 pb-0">
            {resourceType && resourceId && (
                <LayoutTitledScrolls
                    title="details"
                    actionSlot={
                        expanded.length ===
                        Object.keys(ACCORDION_SECTIONS[resourceType]).length ? (
                            <ButtonIcon
                                icon={DoubleArrowUpIcon}
                                onClick={() => setExpanded([])}
                            />
                        ) : (
                            <ButtonIcon
                                icon={DoubleArrowDownIcon}
                                onClick={() =>
                                    setExpanded(
                                        Object.keys(
                                            ACCORDION_SECTIONS[resourceType],
                                        ),
                                    )
                                }
                            />
                        )
                    }
                >
                    <LayoutAccordion
                        key={resourceType}
                        expanded={expanded}
                        setExpanded={setExpanded}
                    >
                        {ACCORDION_SECTIONS[resourceType]}
                    </LayoutAccordion>
                </LayoutTitledScrolls>
            )}
        </Card>
    )
}
