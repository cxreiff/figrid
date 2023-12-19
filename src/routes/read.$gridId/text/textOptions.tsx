import { Button } from "@itsmapleleaf/radix-themes"
import { TextTyper } from "~/components/textTyper.tsx"
import type { IdMap } from "~/routes/read.$gridId/processing.server.ts"
import type { GridQuery } from "~/routes/read.$gridId/query.server.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function TextOptions({
    saveData,
    currentEvent,
    itemIdMap,
    itemInstanceIdMap,
    handleCommand,
}: {
    saveData: SaveData
    currentEvent: GridQuery["events"][0]
    itemIdMap: IdMap<GridQuery["items"][0]>
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>
    handleCommand: (command: string) => void
}) {
    return currentEvent.child_events.length > 0 ? (
        currentEvent.child_events.map(({ trigger, ...event }) => {
            if (trigger === null) {
                return null
            }

            const requiredItem = event.must_have_item_id
                ? saveData.heldItems
                      .map((instance_id) => itemInstanceIdMap[instance_id].item)
                      .find((item) => item.id === event.must_have_item_id)
                : undefined

            const itemMissing =
                event.must_have_item_id && !requiredItem
                    ? ` (missing ${itemIdMap[event.must_have_item_id].name})`
                    : undefined

            const itemTrade =
                event.must_have_item_id && requiredItem
                    ? ` (use ${requiredItem.name})`
                    : undefined

            return (
                <Button
                    key={event.id}
                    variant="ghost"
                    className="mx-2 mb-3 text-base"
                    onClick={() => handleCommand(trigger)}
                    disabled={!!itemMissing}
                >
                    {trigger}
                    {itemMissing}
                    {itemTrade}
                </Button>
            )
        })
    ) : (
        <TextTyper className="pb-6 text-[var(--accent-11)]">
            [press ENTER to continue]
        </TextTyper>
    )
}
