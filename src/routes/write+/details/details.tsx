import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons"
import { useParams } from "@remix-run/react"
import { useMemo, useState } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { LayoutAccordion } from "~/components/layoutAccordion.tsx"
import { LayoutTitledScrolls } from "~/components/layoutTitledScrolls.tsx"
import { Card } from "~/components/ui/card.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { DetailsCharactersEvents } from "~/routes/write+/details/characters/detailsCharactersEvents.tsx"
import { DetailsCharactersTiles } from "~/routes/write+/details/characters/detailsCharactersTiles.tsx"
import { DetailsEventsChildren } from "~/routes/write+/details/events/detailsEventsChildren.tsx"
import { DetailsEventsItems } from "~/routes/write+/details/events/detailsEventsItems.tsx"
import { DetailsEventsLock } from "~/routes/write+/details/events/detailsEventsLock.tsx"
import { DetailsEventsParent } from "~/routes/write+/details/events/detailsEventsParent.tsx"
import { DetailsEventsRequirements } from "~/routes/write+/details/events/detailsEventsRequirements.tsx"
import { DetailsEventsUnlock } from "~/routes/write+/details/events/detailsEventsUnlock.tsx"
import { DetailsGatesFrom } from "~/routes/write+/details/gates/detailsGatesFrom.tsx"
import { DetailsGatesRequirements } from "~/routes/write+/details/gates/detailsGatesRequirements.tsx"
import { DetailsGatesTo } from "~/routes/write+/details/gates/detailsGatesTo.tsx"
import { DetailsItemsEvents } from "~/routes/write+/details/items/detailsItemsEvents.tsx"
import { DetailsItemsTiles } from "~/routes/write+/details/items/detailsItemsTiles.tsx"
import { DetailsLocksEvents } from "~/routes/write+/details/locks/detailsLocksEvents.tsx"
import { DetailsLocksGates } from "~/routes/write+/details/locks/detailsLocksGates.tsx"
import { DetailsLocksItem } from "~/routes/write+/details/locks/detailsLocksItem.tsx"
import { DetailsTilesCharacters } from "~/routes/write+/details/tiles/detailsTilesCharacters.tsx"
import { DetailsTilesEvents } from "~/routes/write+/details/tiles/detailsTilesEvents.tsx"
import { DetailsTilesGates } from "~/routes/write+/details/tiles/detailsTilesGates.tsx"
import { DetailsTilesItems } from "~/routes/write+/details/tiles/detailsTilesItems.tsx"

export function Details() {
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())

    const expandedStateMap = {
        tiles: useState<string[]>([]),
        characters: useState<string[]>([]),
        items: useState<string[]>([]),
        events: useState<string[]>([]),
        gates: useState<string[]>([]),
        locks: useState<string[]>([]),
    }

    const mainSectionMap = useMemo(
        () => ({
            tiles: null,
            characters: null,
            items: null,
            events: null,
            gates: null,
            locks: null,
        }),
        [],
    )

    const accordionSectionMap = useMemo(
        () =>
            ({
                tiles: {
                    gates: DetailsTilesGates,
                    characters: DetailsTilesCharacters,
                    items: DetailsTilesItems,
                    events: DetailsTilesEvents,
                },
                characters: {
                    tiles: DetailsCharactersTiles,
                    events: DetailsCharactersEvents,
                },
                items: {
                    tiles: DetailsItemsTiles,
                    events: DetailsItemsEvents,
                },
                events: {
                    parent: DetailsEventsParent,
                    children: DetailsEventsChildren,
                    unlock: DetailsEventsUnlock,
                    lock: DetailsEventsLock,
                    items: DetailsEventsItems,
                    requirements: DetailsEventsRequirements,
                },
                gates: {
                    from: DetailsGatesFrom,
                    to: DetailsGatesTo,
                    requirements: DetailsGatesRequirements,
                },
                locks: {
                    "required item": DetailsLocksItem,
                    "events": DetailsLocksEvents,
                    "gates": DetailsLocksGates,
                },
            }) as const,
        [],
    )

    const [expanded, setExpanded] = resourceType
        ? expandedStateMap[resourceType]
        : [[], () => {}]

    return (
        <Card className="h-full p-4 pb-0">
            {resourceType && resourceId && (
                <LayoutTitledScrolls
                    title="details"
                    actionSlot={
                        expanded.length ===
                        Object.keys(accordionSectionMap[resourceType])
                            .length ? (
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
                                            accordionSectionMap[resourceType],
                                        ),
                                    )
                                }
                            />
                        )
                    }
                >
                    <div className="border-b px-3 py-5">
                        {mainSectionMap[resourceType]}
                    </div>
                    <LayoutAccordion
                        key={resourceType}
                        expanded={expanded}
                        setExpanded={setExpanded}
                    >
                        {Object.entries(
                            accordionSectionMap[resourceType],
                        ).reduce(
                            (map, [name, Component]) => ({
                                ...map,
                                [name]: <Component />,
                            }),
                            {},
                        )}
                    </LayoutAccordion>
                </LayoutTitledScrolls>
            )}
        </Card>
    )
}
