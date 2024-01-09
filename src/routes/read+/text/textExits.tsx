import { TextTyper } from "~/components/textTyper.tsx"
import { Button } from "~/components/ui/button.tsx"
import type { IdMap, TileWithCoords } from "~/routes/read+/processing.server.ts"
import type { SaveData } from "~/lib/useSaveData.ts"
import { splitRequirements } from "~/routes/read+/commands.ts"
import type { GridQuery } from "~/routes/read+/queries.server.ts"

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
        currentTile.gates.length > 0
            ? `there ${currentTile.gates.length === 1 ? "is an" : "are"} exit${
                  currentTile.gates.length === 1 ? "" : "s"
              } `
            : "there are no exits."

    const exitsButtons = currentTile.gates
        .map((gate) => {
            const { unfulfilledLocks, unfulfilledItems } = splitRequirements(
                saveData,
                itemInstanceIdMap,
                gate.requirements,
            )
            const unfulfilled = [...unfulfilledLocks, ...unfulfilledItems]
            const unfulfilledMessage =
                unfulfilled.length > 0
                    ? ` (${unfulfilled
                          .map((requirement) => requirement.summary)
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
            index === currentTile.gates.length - 1
                ? "."
                : index === currentTile.gates.length - 2
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
