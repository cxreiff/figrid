import { TextTyper } from "~/components/textTyper.tsx"
import { Button } from "~/components/ui/button.tsx"
import type { IdMap, TileWithCoords } from "~/routes/read+/processing.server.ts"
import type { SaveData } from "~/lib/useSaveData.ts"
import type { GridQuery } from "~/routes/read+/queries.server.ts"
import { splitLocks } from "~/routes/read+/commands.ts"

export function TextExits({
    saveData,
    currentTile,
    itemInstanceIdMap,
    handleCommand,
}: {
    saveData: SaveData
    currentTile: TileWithCoords
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>
    handleCommand: (command: string) => void
}) {
    const exitsPrefix =
        currentTile.gates_out.length > 0
            ? `there ${
                  currentTile.gates_out.length === 1 ? "is an" : "are"
              } exit${currentTile.gates_out.length === 1 ? "" : "s"} `
            : "there are no exits."

    const exitsButtons = currentTile.gates_out
        .map((gate) => {
            const { unfulfilled } = splitLocks(
                gate.lock_instances,
                saveData,
                itemInstanceIdMap,
            )
            const unfulfilledMessage =
                unfulfilled.length > 0
                    ? ` (${unfulfilled
                          .map(({ lock }) => lock.summary)
                          .join(" ")
                          .trim()})`
                    : undefined

            return (
                <Button
                    key={gate.id}
                    variant="inline"
                    className="text-base"
                    onClick={() => handleCommand(`look ${gate.type}`)}
                    disabled={unfulfilled.length > 0}
                >
                    {gate.type}
                    {unfulfilledMessage}
                </Button>
            )
        })
        .flatMap((button, index) => [
            button,
            index === currentTile.gates_out.length - 1
                ? "."
                : index === currentTile.gates_out.length - 2
                  ? " and "
                  : ", ",
        ])

    return (
        <div className="pb-6">
            <TextTyper className="inline-block" key={currentTile.id}>
                {exitsPrefix}
            </TextTyper>
            {exitsButtons}
        </div>
    )
}
