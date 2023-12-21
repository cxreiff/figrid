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
                            {`you see ${summary}`
                                .split(name)
                                .flatMap((text, index) => [
                                    <TextTyper
                                        key={index}
                                        className="inline-block"
                                    >
                                        {text}
                                    </TextTyper>,
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        className="text-base"
                                        onClick={() =>
                                            handleCommand(`look ${name}`)
                                        }
                                    >
                                        <TextTyper className="inline-block">
                                            {name}
                                        </TextTyper>
                                    </Button>,
                                ])
                                .slice(0, -1)}
                            .
                        </span>
                    ) : null,
            )}
        </div>
    ) : null
}
