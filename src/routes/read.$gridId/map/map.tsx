import {
    ArrowDownIcon,
    ArrowUpIcon,
    CubeIcon,
    PersonIcon,
} from "@radix-ui/react-icons"
import { useContext } from "react"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import { availableItemsMap } from "~/routes/read.$gridId/commands.ts"
import type { TileWithCoords } from "~/routes/read.$gridId/processing.server.ts"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import { indicesArray } from "~/utilities/misc.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

const MAP_DIMENSIONS = { x: 5, y: 13 }

export function Map() {
    const { tileIdMap, tileCoordsMap } = useSuperLoaderData<typeof loader>()
    const handleCommand = useContext(ContextCommand)

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
                        <WaitSaveData
                            key={offset.join(",")}
                            meanwhile={<BlankTile />}
                            asChild
                        >
                            {(saveData) => {
                                const currentTile = tileIdMap[
                                    saveData.currentTileId
                                ] as TileWithCoords
                                const tileId =
                                    tileCoordsMap[
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
                                                case "east":
                                                case "south":
                                                case "west":
                                                    return (
                                                        <div
                                                            key={`${gate.id}`}
                                                            className={`absolute ${
                                                                {
                                                                    north: "-top-2 left-0 right-0 mx-auto h-2 w-4",
                                                                    east: "-right-2 bottom-0 top-0 my-auto h-4 w-2",
                                                                    south: "-bottom-2 left-0 right-0 mx-auto h-2 w-4",
                                                                    west: "-left-2 bottom-0 top-0 my-auto h-4 w-2",
                                                                }[gate.type]
                                                            } ${
                                                                gate.requirements.find(
                                                                    ({
                                                                        lock,
                                                                    }) =>
                                                                        !saveData.unlocked.includes(
                                                                            lock.id,
                                                                        ),
                                                                )
                                                                    ? "bg-zinc-400"
                                                                    : "bg-[var(--accent-8)]"
                                                            }`}
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
                        </WaitSaveData>
                    )),
                )}
            </div>
        </div>
    )
}
