import { useParams } from "@remix-run/react"
import { useMemo, useState } from "react"
import { Card } from "~/components/ui/card.tsx"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import { DetailsCharactersEvents } from "~/routes/write+/details/characters/detailsCharactersEvents.tsx"
import { DetailsCharactersTiles } from "~/routes/write+/details/characters/detailsCharactersTiles.tsx"
import { DetailsActions } from "~/routes/write+/details/detailsActions.tsx"
import { DetailsInfo } from "~/routes/write+/details/detailsInfo.tsx"
import { DetailsEventsChildren } from "~/routes/write+/details/events/detailsEventsChildren.tsx"
import { DetailsEventsItems } from "~/routes/write+/details/events/detailsEventsItems.tsx"
import { DetailsEventsLock } from "~/routes/write+/details/events/detailsEventsLock.tsx"
import { DetailsEventsParent } from "~/routes/write+/details/events/detailsEventsParent.tsx"
import { DetailsEventsRequirements } from "~/routes/write+/details/events/detailsEventsRequirements.tsx"
import { DetailsEventsUnlock } from "~/routes/write+/details/events/detailsEventsUnlock.tsx"
import { DetailsGatesEvents } from "~/routes/write+/details/gates/detailsGatesEvents.tsx"
import { DetailsGatesMain } from "~/routes/write+/details/gates/detailsGatesMain.tsx"
import { DetailsGatesRequirements } from "~/routes/write+/details/gates/detailsGatesRequirements.tsx"
import { DetailsItemsEvents } from "~/routes/write+/details/items/detailsItemsEvents.tsx"
import { DetailsItemsTiles } from "~/routes/write+/details/items/detailsItemsTiles.tsx"
import { DetailsLocksEvents } from "~/routes/write+/details/locks/detailsLocksEvents.tsx"
import { DetailsLocksGates } from "~/routes/write+/details/locks/detailsLocksGates.tsx"
import { DetailsLocksItem } from "~/routes/write+/details/locks/detailsLocksItem.tsx"
import { DetailsTilesCharacters } from "~/routes/write+/details/tiles/detailsTilesCharacters.tsx"
import { DetailsTilesEvents } from "~/routes/write+/details/tiles/detailsTilesEvents.tsx"
import { DetailsTilesGates } from "~/routes/write+/details/tiles/detailsTilesGates.tsx"
import { DetailsTilesItems } from "~/routes/write+/details/tiles/detailsTilesItems.tsx"
import { ResourcePlaceholder } from "~/routes/write+/resourcePlaceholder.tsx"

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
            tiles: undefined,
            characters: undefined,
            items: undefined,
            events: undefined,
            gates: DetailsGatesMain,
            locks: undefined,
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
                    events: DetailsGatesEvents,
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

    const MainSection = resourceType ? mainSectionMap[resourceType] : undefined

    return (
        <div className="flex h-full flex-col gap-3">
            <Card className="min-h-0 flex-1 p-4 pb-0">
                {resourceType && resourceId ? (
                    <DetailsInfo
                        resourceType={resourceType}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        mainSection={MainSection}
                        accordionSection={accordionSectionMap[resourceType]}
                    />
                ) : (
                    <ResourcePlaceholder>select a resource</ResourcePlaceholder>
                )}
            </Card>
            <Card className="flex-0 p-4">
                {resourceType && resourceId ? (
                    <DetailsActions
                        resourceType={resourceType}
                        resourceId={resourceId}
                    />
                ) : (
                    <ResourcePlaceholder>select a resource</ResourcePlaceholder>
                )}
            </Card>
        </div>
    )
}
