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

const MAP_DIMENSIONS = { x: 13, y: 19 }
const TILE_DIMENSIONS = { x: 6, y: 6 }

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
        <div className="h-24 border border-dashed border-muted-foreground opacity-50" />
    )

    return (
        <div className="faded-edge flex h-full w-full items-center justify-center overflow-hidden rounded-lg">
            <div>
                <div
                    className="relative grid h-full gap-3"
                    style={{
                        width: `${
                            MAP_DIMENSIONS.x * TILE_DIMENSIONS.x +
                            (MAP_DIMENSIONS.x - 1) * 0.75
                        }rem`,
                        gridTemplateColumns: `repeat(${MAP_DIMENSIONS.x}, minmax(0, 1fr))`,
                    }}
                >
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
                                                currentTile.coords![0] +
                                                    offset[0],
                                                currentTile.coords![1] +
                                                    offset[1],
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
                                            style={{
                                                width: `${TILE_DIMENSIONS.x}rem`,
                                                height: `${TILE_DIMENSIONS.y}rem`,
                                            }}
                                            className={`relative box-border border-2 border-secondary-foreground duration-300 animate-in fade-in ${
                                                handleClick
                                                    ? "cursor-pointer hover:shadow-[inset_hsl(var(--accent))_0_0_0_0.3rem]"
                                                    : ""
                                            } ${
                                                tileId ===
                                                saveData.currentTileId
                                                    ? "shadow-[inset_hsl(var(--accent))_0_0_0_0.3rem]"
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
                                                                        north: "-top-2 left-0 right-0 mx-auto h-2 w-4 border-x-2 border-x-muted-foreground",
                                                                        east: "-right-2 bottom-0 top-0 my-auto h-4 w-2 border-y-2 border-y-muted-foreground",
                                                                        south: "-bottom-2 left-0 right-0 mx-auto h-2 w-4 border-x-2 border-x-muted-foreground",
                                                                        west: "-left-2 bottom-0 top-0 my-auto h-4 w-2 border-y-2 border-y-muted-foreground",
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
                                                                        ? "bg-secondary-foreground"
                                                                        : "bg-background"
                                                                }`}
                                                            />
                                                        )
                                                    case "up":
                                                        return (
                                                            <ArrowUpIcon
                                                                key={`${gate.id}`}
                                                                className={`absolute left-3 top-3 h-6 w-6 ${
                                                                    tileId ===
                                                                    saveData.currentTileId
                                                                        ? "cursor-pointer text-accent-foreground hover:bg-accent"
                                                                        : "text-secondary-foreground"
                                                                }`}
                                                                onClick={
                                                                    tileId ===
                                                                    saveData.currentTileId
                                                                        ? () =>
                                                                              handleCommand(
                                                                                  "go up",
                                                                              )
                                                                        : undefined
                                                                }
                                                            />
                                                        )
                                                    case "down":
                                                        return (
                                                            <ArrowDownIcon
                                                                key={`${gate.id}`}
                                                                className={`absolute bottom-3 left-3 h-6 w-6  ${
                                                                    tileId ===
                                                                    saveData.currentTileId
                                                                        ? "cursor-pointer text-accent-foreground hover:bg-accent"
                                                                        : "text-secondary-foreground"
                                                                }`}
                                                                onClick={() =>
                                                                    handleCommand(
                                                                        "go down",
                                                                    )
                                                                }
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
                                                <CubeIcon className="absolute bottom-3 right-3 h-6 w-6 text-secondary-foreground" />
                                            )}
                                            {mapTile.character_instances
                                                .length > 0 && (
                                                <PersonIcon className="absolute right-3 top-3 h-6 w-6 text-secondary-foreground" />
                                            )}
                                        </div>
                                    )
                                }}
                            </WaitSaveData>
                        )),
                    )}
                </div>
            </div>
        </div>
    )
}
