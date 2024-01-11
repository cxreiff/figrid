import { Button } from "~/components/ui/button.tsx"
import type { IdMap } from "~/routes/read+/processing.server.ts"
import type { GridQuery } from "~/routes/read+/queries.server.ts"
import type { SaveData } from "~/lib/useSaveData.ts"
import { splitLocks } from "~/routes/read+/commands.ts"
import { defined } from "~/lib/misc.ts"

export function TextOptions({
    saveData,
    currentEvent,
    eventIdMap,
    itemIdMap,
    itemInstanceIdMap,
    handleCommand,
}: {
    saveData: SaveData
    currentEvent: GridQuery["events"][0]
    eventIdMap: IdMap<GridQuery["events"][0]>
    itemIdMap: IdMap<GridQuery["items"][0]>
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>
    handleCommand: (command: string) => void
}) {
    return currentEvent.child_events.length > 0 ? (
        currentEvent.child_events.map((event) => {
            if (event.trigger === null) {
                return null
            }

            const { fulfilled, unfulfilled } = splitLocks(
                eventIdMap[event.id].locked_by,
                saveData,
                itemInstanceIdMap,
            )

            if (unfulfilled.find(({ visible }) => !visible)) {
                return null
            }

            const unfulfilledMessage =
                unfulfilled.length > 0
                    ? ` (${unfulfilled
                          .map(({ lock }) => lock.summary)
                          .join(" ")
                          .trim()})`
                    : undefined

            const fulfilledItemIds = fulfilled
                .map(({ lock }) => lock.required_item_id)
                .filter(defined)

            const tradeMessage =
                fulfilledItemIds.length > 0
                    ? ` (use ${fulfilledItemIds
                          .map((itemId) => itemIdMap[itemId].name)
                          .join(", ")})`
                    : undefined

            return (
                <Button
                    key={event.id}
                    variant="inline"
                    className="mx-2 mb-3 text-base"
                    onClick={() => handleCommand(event.trigger || "")}
                    disabled={unfulfilled.length > 0}
                >
                    {event.trigger}
                    {unfulfilledMessage}
                    {tradeMessage}
                </Button>
            )
        })
    ) : (
        <Button
            variant="inline"
            className="mx-2 mb-3 text-base"
            onClick={() => handleCommand("")}
        >
            [any command to continue]
        </Button>
    )
}
