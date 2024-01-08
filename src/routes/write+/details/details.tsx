import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons"
import { useParams } from "@remix-run/react"
import { useEffect, useState } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutAccordion } from "~/components/layoutAccordion.tsx"
import { LayoutTitledScrolls } from "~/components/layoutTitledScrolls.tsx"
import { Card } from "~/components/ui/card.tsx"
import { paramsSchema } from "~/routes/write+/+$gridId.$resourceType.$resourceId.tsx"

export function Details() {
    const [expanded, setExpanded] = useState<string[]>([])
    const { resourceType } = paramsSchema.partial().parse(useParams())

    useEffect(() => {
        setExpanded([])
    }, [resourceType])

    const ACCORDION_SECTIONS = {
        tiles: {
            gates: "list of gates",
            characters: "list of characters",
            items: "list of items",
            events: "list of events",
        },
        characters: {
            tiles: "list of character instances in tiles",
            dialogue: "list of dialogue events",
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
    }

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
                                onClick={() =>
                                    setExpanded(
                                        Object.keys(
                                            ACCORDION_SECTIONS[resourceType],
                                        ),
                                    )
                                }
                            />
                        </>
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
