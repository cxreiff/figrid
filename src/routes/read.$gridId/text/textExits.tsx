import { Button } from "@itsmapleleaf/radix-themes"
import { TextTyper } from "~/components/textTyper.tsx"
import type { TileWithCoords } from "~/routes/read.$gridId/processing.server.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function TextExits({
    saveData,
    currentTile,
    handleCommand,
}: {
    saveData: SaveData
    currentTile: TileWithCoords
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
            const lock = gate.requirements.find(
                (gate) => !saveData.unlocked.includes(gate.lock_id),
            )
            const lockMessage = lock ? ` (${lock.summary})` : undefined

            return (
                <Button
                    key={gate.id}
                    variant="ghost"
                    className="m-0 p-0 text-base"
                    onClick={() => handleCommand(`go ${gate.type}`)}
                    disabled={!!lock}
                >
                    {gate.type}
                    {lockMessage}
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
