import {
    ArrowDownIcon,
    ArrowUpIcon,
    CubeIcon,
    PersonIcon,
} from "@radix-ui/react-icons"
import { Wait } from "~/components/wait.tsx"
import { availableItemsMap } from "~/routes/read.$gridId/commands.ts"
import type {
    CoordsMap,
    IdMap,
    TileWithCoords,
} from "~/routes/read.$gridId/processing.ts"
import { indicesArray } from "~/utilities/misc.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

const MAP_DIMENSIONS = { x: 5, y: 13 }

export function Map({
    saveData,
    tileIdMap,
    coordsMap,
    handleCommand,
}: {
    saveData?: SaveData
    tileIdMap: IdMap<TileWithCoords>
    coordsMap: CoordsMap
    handleCommand: (command: string) => void
}) {
    const offsetMatrix = indicesArray(MAP_DIMENSIONS.y).map((y) =>
        indicesArray(MAP_DIMENSIONS.x).map((x) => [
            x - Math.ceil(MAP_DIMENSIONS.x / 2),
            y - Math.ceil(MAP_DIMENSIONS.y / 2),
        ]),
    )

    const BlankTile = () => (
        <div className="h-24 border border-dashed border-zinc-500" />
    )

    return (
        <div className="faded-edge flex max-h-[100%] items-center justify-center overflow-hidden rounded-lg">
            <div className="grid h-full w-full grid-cols-5 gap-3">
                {offsetMatrix.map((row) =>
                    row.map((offset) => (
                        <Wait
                            key={offset.join(",")}
                            on={saveData}
                            meanwhile={<BlankTile />}
                            asChild
                        >
                            {(saveData) => {
                                const currentTile =
                                    tileIdMap[saveData.currentTileId]
                                const tileId =
                                    coordsMap[
                                        [
                                            currentTile.coords![0] + offset[0],
                                            currentTile.coords![1] + offset[1],
                                            currentTile.coords![2],
                                        ].join(",")
                                    ]
                                const mapTile = tileId && tileIdMap[tileId]

                                if (!mapTile) {
                                    return <BlankTile />
                                }

                                let handleClick
                                for (const gate of currentTile.gates) {
                                    if (tileId === gate.to_id) {
                                        handleClick = () =>
                                            handleCommand(`go ${gate.type}`)
                                    }
                                }

                                return (
                                    <div
                                        key={tileId}
                                        className={`relative h-24 border-2 border-[var(--accent-8)] duration-500 animate-in fade-in ${
                                            handleClick
                                                ? "cursor-pointer hover:bg-zinc-600"
                                                : ""
                                        } ${
                                            tileId === saveData.currentTileId
                                                ? "bg-[var(--accent-8)]"
                                                : ""
                                        }`}
                                        onClick={handleClick}
                                    >
                                        {mapTile.gates.map((gate) => {
                                            switch (gate.type) {
                                                case "north":
                                                    return (
                                                        <div
                                                            key={`${gate.id}`}
                                                            className="absolute left-0 right-0 top-[-1rem] mx-auto h-4 w-4 bg-[var(--accent-8)]"
                                                        />
                                                    )
                                                case "east":
                                                    return (
                                                        <div
                                                            key={`${gate.id}`}
                                                            className="absolute bottom-0 right-[-1rem] top-0 my-auto h-4 w-4 bg-[var(--accent-8)]"
                                                        />
                                                    )
                                                case "south":
                                                    return (
                                                        <div
                                                            key={`${gate.id}`}
                                                            className="absolute bottom-[-1rem] left-0 right-0 mx-auto h-4 w-4 bg-[var(--accent-8)]"
                                                        />
                                                    )
                                                case "west":
                                                    return (
                                                        <div
                                                            key={`${gate.id}`}
                                                            className="absolute bottom-0 left-[-1rem] top-0 my-auto h-4 w-4 bg-[var(--accent-8)]"
                                                        />
                                                    )
                                                case "up":
                                                    return tileId ===
                                                        saveData.currentTileId ? (
                                                        <ArrowUpIcon
                                                            key={`${gate.id}`}
                                                            className="absolute left-2 top-2 h-6 w-6 cursor-pointer hover:text-zinc-400"
                                                            onClick={() =>
                                                                handleCommand(
                                                                    "go up",
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <ArrowUpIcon
                                                            key={`${gate.id}`}
                                                            className="absolute left-2 top-2 h-6 w-6 text-zinc-400"
                                                        />
                                                    )
                                                case "down":
                                                    return tileId ===
                                                        saveData.currentTileId ? (
                                                        <ArrowDownIcon
                                                            key={`${gate.id}`}
                                                            className="absolute bottom-2 left-2 h-6 w-6 cursor-pointer hover:text-zinc-400"
                                                            onClick={() =>
                                                                handleCommand(
                                                                    "go down",
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <ArrowDownIcon
                                                            key={`${gate.id}`}
                                                            className="absolute bottom-2 left-2 h-6 w-6 text-zinc-400"
                                                        />
                                                    )
                                                default:
                                                    return null
                                            }
                                        })}
                                        {Object.values(
                                            availableItemsMap(
                                                mapTile,
                                                saveData,
                                            ),
                                        ).length > 0 && (
                                            <CubeIcon className="absolute bottom-2 right-2 h-6 w-6 text-zinc-400" />
                                        )}
                                        {mapTile.character_instances.length >
                                            0 && (
                                            <PersonIcon className="absolute right-2 top-2 h-6 w-6 text-zinc-400" />
                                        )}
                                    </div>
                                )
                            }}
                        </Wait>
                    )),
                )}
            </div>
        </div>
    )
}
