import { Button } from "@itsmapleleaf/radix-themes"
import { TextTyper } from "~/components/textTyper.tsx"
import type { TileWithCoords } from "~/routes/read.$gridId/processing.server.ts"

export function TextCharacters({
    currentTile,
    handleCommand,
}: {
    currentTile: TileWithCoords
    handleCommand: (command: string) => void
}) {
    return currentTile.character_instances.length > 0 ? (
        <div className="pb-6">
            {currentTile.character_instances.map(
                ({ character: { summary, id, name } }) =>
                    summary ? (
                        <span key={id} className="inline-block pr-2">
                            <TextTyper className="inline-block">
                                {"you see "}
                            </TextTyper>
                            <Button
                                variant="ghost"
                                className="text-base"
                                onClick={() => handleCommand(`look ${name}`)}
                            >
                                {summary}
                            </Button>
                            .
                        </span>
                    ) : null,
            )}
        </div>
    ) : null
}
