import { useParams } from "@remix-run/react"
import { useMemo, useState } from "react"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { DetailsCharactersEvents } from "~/routes/write+/ui/details/characters/detailsCharactersEvents.tsx"
import { DetailsCharactersTiles } from "~/routes/write+/ui/details/characters/detailsCharactersTiles.tsx"
import { DetailsActions } from "~/routes/write+/ui/details/detailsActions.tsx"
import { DetailsInfo } from "~/routes/write+/ui/details/detailsInfo.tsx"
import { DetailsEventsChildren } from "~/routes/write+/ui/details/events/detailsEventsChildren.tsx"
import { DetailsEventsItems } from "~/routes/write+/ui/details/events/detailsEventsItems.tsx"
import { DetailsEventsLock } from "~/routes/write+/ui/details/events/detailsEventsLock.tsx"
import { DetailsEventsParent } from "~/routes/write+/ui/details/events/detailsEventsParent.tsx"
import { DetailsEventsRequirements } from "~/routes/write+/ui/details/events/detailsEventsRequirements.tsx"
import { DetailsEventsUnlock } from "~/routes/write+/ui/details/events/detailsEventsUnlock.tsx"
import { DetailsGatesEvents } from "~/routes/write+/ui/details/gates/detailsGatesEvents.tsx"
import { DetailsGatesMain } from "~/routes/write+/ui/details/gates/detailsGatesMain.tsx"
import { DetailsGatesRequirements } from "~/routes/write+/ui/details/gates/detailsGatesRequirements.tsx"
import { DetailsItemsEvents } from "~/routes/write+/ui/details/items/detailsItemsEvents.tsx"
import { DetailsItemsMain } from "~/routes/write+/ui/details/items/detailsItemsMain.tsx"
import { DetailsItemsTiles } from "~/routes/write+/ui/details/items/detailsItemsTiles.tsx"
import { DetailsLocksEvents } from "~/routes/write+/ui/details/locks/detailsLocksEvents.tsx"
import { DetailsLocksGates } from "~/routes/write+/ui/details/locks/detailsLocksGates.tsx"
import { DetailsLocksItem } from "~/routes/write+/ui/details/locks/detailsLocksItem.tsx"
import { DetailsTilesCharacters } from "~/routes/write+/ui/details/tiles/detailsTilesCharacters.tsx"
import { DetailsTilesEvents } from "~/routes/write+/ui/details/tiles/detailsTilesEvents.tsx"
import { DetailsTilesGates } from "~/routes/write+/ui/details/tiles/detailsTilesGates.tsx"
import { DetailsTilesItems } from "~/routes/write+/ui/details/tiles/detailsTilesItems.tsx"
import { Placeholder } from "~/ui/placeholder.tsx"
import { LayoutFooter } from "~/ui/layout/layoutFooter.tsx"
import { Card } from "~/ui/primitives/card.tsx"
import { DetailsEventsMain } from "./events/detailsEventsMain.tsx"

export function DetailsMain() {
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
            items: DetailsItemsMain,
            events: DetailsEventsMain,
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
        <LayoutFooter>
            <Card className="h-full p-4 pb-0">
                {resourceType && resourceId ? (
                    <DetailsInfo
                        resourceType={resourceType}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        mainSection={MainSection}
                        accordionSection={accordionSectionMap[resourceType]}
                    />
                ) : (
                    <Placeholder>select a resource</Placeholder>
                )}
            </Card>
            <Card className="h-full p-4">
                {resourceType && resourceId ? (
                    <DetailsActions
                        resourceType={resourceType}
                        resourceId={resourceId}
                    />
                ) : (
                    <Placeholder>select a resource</Placeholder>
                )}
            </Card>
        </LayoutFooter>
    )
}
