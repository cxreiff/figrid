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
import { DetailsEventsChildren } from "~/routes/write+/details/detailsEventsChildren.tsx"
import { DetailsEventsItems } from "~/routes/write+/details/detailsEventsItems.tsx"
import { DetailsEventsLock } from "~/routes/write+/details/detailsEventsLock.tsx"
import { DetailsEventsParent } from "~/routes/write+/details/detailsEventsParent.tsx"
import { DetailsEventsRequirements } from "~/routes/write+/details/detailsEventsRequirements.tsx"
import { DetailsEventsUnlock } from "~/routes/write+/details/detailsEventsUnlock.tsx"
import { DetailsGatesFrom } from "~/routes/write+/details/detailsGatesFrom.tsx"
import { DetailsGatesRequirements } from "~/routes/write+/details/detailsGatesRequirements.tsx"
import { DetailsGatesTo } from "~/routes/write+/details/detailsGatesTo.tsx"
import { DetailsItemsEvents } from "~/routes/write+/details/detailsItemsEvents.tsx"
import { DetailsItemsTiles } from "~/routes/write+/details/detailsItemsTiles.tsx"
import { DetailsLocksEvents } from "~/routes/write+/details/detailsLocksEvents.tsx"
import { DetailsLocksGates } from "~/routes/write+/details/detailsLocksGates.tsx"
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
                tiles: <DetailsItemsTiles />,
                events: <DetailsItemsEvents />,
            },
            events: {
                parent: <DetailsEventsParent />,
                children: <DetailsEventsChildren />,
                unlock: <DetailsEventsUnlock />,
                lock: <DetailsEventsLock />,
                items: <DetailsEventsItems />,
                requirements: <DetailsEventsRequirements />,
            },
            gates: {
                from: <DetailsGatesFrom />,
                to: <DetailsGatesTo />,
                requirements: <DetailsGatesRequirements />,
            },
            locks: {
                events: <DetailsLocksEvents />,
                gates: <DetailsLocksGates />,
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
