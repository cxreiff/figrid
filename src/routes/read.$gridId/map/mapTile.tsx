import {
    ArrowDownIcon,
    ArrowUpIcon,
    CubeIcon,
    PersonIcon,
} from "@radix-ui/react-icons"
import { useContext } from "react"
import { Button } from "~/components/ui/button.tsx"
import { availableItemsMap } from "~/routes/read.$gridId/commands.ts"
import { TILE_DIMENSIONS } from "~/routes/read.$gridId/map/map.tsx"
import type { TileWithCoords } from "~/routes/read.$gridId/processing.server.ts"
import { ContextCommand } from "~/utilities/contextCommand.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function MapTile({
    saveData,
    tileId,
    mapTile,
    handleClick,
}: {
    saveData: SaveData
    tileId: number
    mapTile: TileWithCoords
    handleClick?: () => void
}) {
    const handleCommand = useContext(ContextCommand)

    return (
        <div
            key={tileId}
            style={{
                width: `${TILE_DIMENSIONS.x}rem`,
                height: `${TILE_DIMENSIONS.y}rem`,
            }}
            className={`relative box-border border-2 border-secondary-foreground ${
                handleClick
                    ? "cursor-pointer transition-colors duration-500 before:absolute before:inset-2 before:rounded-lg before:bg-transparent hover:before:bg-[hsla(var(--accent)/0.4)]"
                    : ""
            } ${
                tileId === saveData.currentTileId
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
                                        north: "-top-2 left-0 right-0 mx-auto h-2 w-4 border-x-2 border-x-secondary-foreground",
                                        east: "-right-2 bottom-0 top-0 my-auto h-4 w-2 border-y-2 border-y-secondary-foreground",
                                        south: "-bottom-2 left-0 right-0 mx-auto h-2 w-4 border-x-2 border-x-secondary-foreground",
                                        west: "-left-2 bottom-0 top-0 my-auto h-4 w-2 border-y-2 border-y-secondary-foreground",
                                    }[gate.type]
                                } ${
                                    gate.requirements.find(
                                        ({ lock }) =>
                                            !saveData.unlocked.includes(
                                                lock.id,
                                            ),
                                    )
                                        ? "bg-secondary-foreground"
                                        : "bg-card"
                                }`}
                            />
                        )
                    case "up":
                        return (
                            <Button
                                key={`${gate.id}`}
                                className={`absolute left-3 top-3 h-6 w-6 disabled:text-secondary-foreground ${
                                    tileId === saveData.currentTileId
                                        ? "text-accent-foreground"
                                        : "text-secondary-foreground"
                                }`}
                                onClick={
                                    tileId === saveData.currentTileId
                                        ? () => handleCommand("go up")
                                        : undefined
                                }
                                disabled={
                                    tileId !== saveData.currentTileId ||
                                    !!saveData.currentEventId
                                }
                                variant="ghost"
                                size="icon"
                            >
                                <ArrowUpIcon className="h-full w-full" />
                            </Button>
                        )
                    case "down":
                        return (
                            <Button
                                key={`${gate.id}`}
                                className={`absolute bottom-3 left-3 h-6 w-6 disabled:text-secondary-foreground ${
                                    tileId === saveData.currentTileId
                                        ? "text-accent-foreground"
                                        : "text-secondary-foreground"
                                }`}
                                onClick={
                                    tileId === saveData.currentTileId
                                        ? () => handleCommand("go down")
                                        : undefined
                                }
                                disabled={
                                    tileId !== saveData.currentTileId ||
                                    !!saveData.currentEventId
                                }
                                variant="ghost"
                                size="icon"
                            >
                                <ArrowDownIcon className="h-full w-full" />
                            </Button>
                        )
                    default:
                        return null
                }
            })}
            {Object.values(availableItemsMap(mapTile, saveData)).length > 0 && (
                <CubeIcon className="absolute bottom-3 right-3 h-6 w-6 text-secondary-foreground" />
            )}
            {mapTile.character_instances.length > 0 && (
                <PersonIcon className="absolute right-3 top-3 h-6 w-6 text-secondary-foreground" />
            )}
        </div>
    )
}
