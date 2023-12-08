import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons"
import { Wait } from "~/components/wait.tsx"
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
                            {({ currentTileId }) => {
                                const currentTile = tileIdMap[currentTileId]
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
                                switch (tileId) {
                                    case currentTile.north_id:
                                        handleClick = () =>
                                            handleCommand("go north")
                                        break
                                    case currentTile.east_id:
                                        handleClick = () =>
                                            handleCommand("go east")
                                        break
                                    case currentTile.south_id:
                                        handleClick = () =>
                                            handleCommand("go south")
                                        break
                                    case currentTile.west_id:
                                        handleClick = () =>
                                            handleCommand("go west")
                                        break
                                }

                                return (
                                    <div
                                        key={tileId}
                                        className={`relative h-24 border-2 border-[var(--accent-8)] duration-500 animate-in fade-in ${
                                            handleClick
                                                ? "cursor-pointer hover:bg-zinc-600"
                                                : ""
                                        } ${
                                            tileId === currentTileId
                                                ? "bg-[var(--accent-8)]"
                                                : ""
                                        }`}
                                        onClick={handleClick}
                                    >
                                        {mapTile.north_id && (
                                            <div className="absolute left-0 right-0 top-[-1rem] mx-auto h-4 w-4 bg-[var(--accent-8)]" />
                                        )}
                                        {mapTile.east_id && (
                                            <div className="absolute bottom-0 right-[-1rem] top-0 my-auto h-4 w-4 bg-[var(--accent-8)]" />
                                        )}
                                        {mapTile.south_id && (
                                            <div className="absolute bottom-[-1rem] left-0 right-0 mx-auto h-4 w-4 bg-[var(--accent-8)]" />
                                        )}
                                        {mapTile.west_id && (
                                            <div className="absolute bottom-0 left-[-1rem] top-0 my-auto h-4 w-4 bg-[var(--accent-8)]" />
                                        )}
                                        {mapTile.up_id &&
                                            (tileId === currentTileId ? (
                                                <ArrowUpIcon
                                                    className="absolute right-2 top-2 h-8 w-8 cursor-pointer hover:text-zinc-400"
                                                    onClick={() =>
                                                        handleCommand("go up")
                                                    }
                                                />
                                            ) : (
                                                <ArrowUpIcon className="absolute right-2 top-2 h-8 w-8 text-zinc-400" />
                                            ))}
                                        {mapTile.down_id &&
                                            (tileId === currentTileId ? (
                                                <ArrowDownIcon
                                                    className="absolute left-2 top-2 h-8 w-8 cursor-pointer hover:text-zinc-400"
                                                    onClick={() =>
                                                        handleCommand("go down")
                                                    }
                                                />
                                            ) : (
                                                <ArrowDownIcon className="absolute left-2 top-2 h-8 w-8 text-zinc-400" />
                                            ))}
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
