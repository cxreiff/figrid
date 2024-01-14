import {
    ArrowDownIcon,
    ArrowUpIcon,
    CubeIcon,
    PersonIcon,
} from "@radix-ui/react-icons"
import { Button } from "~/components/ui/button.tsx"
import { TILE_DIMENSIONS } from "~/routes/write+/map/map.tsx"
import type { WriteTileWithCoords } from "~/routes/read+/processing.server.ts"
import { useNavigate, useParams } from "@remix-run/react"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"

export function MapTile({
    current,
    mapTile,
}: {
    current: boolean
    mapTile?: WriteTileWithCoords
}) {
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())

    const navigate = useNavigate()

    if (!mapTile) {
        return (
            <div
                style={{
                    width: `${TILE_DIMENSIONS.x}rem`,
                    height: `${TILE_DIMENSIONS.y}rem`,
                }}
                className="border border-dashed border-muted-foreground opacity-50"
            />
        )
    }

    return (
        <div
            key={mapTile.id}
            style={{
                width: `${TILE_DIMENSIONS.x}rem`,
                height: `${TILE_DIMENSIONS.y}rem`,
            }}
            className={`
                relative box-border border-2 border-secondary-foreground before:absolute
                before:inset-1 before:rounded-md before:bg-transparent ${
                    current && resourceType === "tiles"
                        ? "shadow-[inset_hsl(var(--accent))_0_0_0_0.2rem]"
                        : "cursor-pointer hover:shadow-[inset_hsl(var(--accent))_0_0_0_0.2rem] has-[div:hover]:cursor-auto has-[div:hover]:shadow-none"
                }
            `}
            onClick={() => navigate(`tiles/${mapTile.id}`)}
        >
            {mapTile.gates_out.map((gate) => {
                switch (gate.type) {
                    case "north":
                    case "east":
                    case "south":
                    case "west":
                        return (
                            <div
                                key={`${gate.id}`}
                                className={`
                                    gate absolute z-10 before:absolute
                                    before:inset-0.5 before:rounded-sm ${
                                        {
                                            north: "-top-5 left-0 right-0 mx-auto h-5 w-6 border-x-2 border-x-secondary-foreground",
                                            east: "-right-5 bottom-0 top-0 my-auto h-6 w-5 border-y-2 border-y-secondary-foreground",
                                            south: "-bottom-5 left-0 right-0 mx-auto h-5 w-6 border-x-2 border-x-secondary-foreground",
                                            west: "-left-5 bottom-0 top-0 my-auto h-6 w-5 border-y-2 border-y-secondary-foreground",
                                        }[gate.type]
                                    } ${
                                        gate.lock_instances.length > 0
                                            ? "bg-secondary-foreground"
                                            : "bg-card"
                                    } ${
                                        current &&
                                        resourceType === "gates" &&
                                        resourceId === gate.id
                                            ? "shadow-[inset_hsl(var(--accent))_0_0_0_0.2rem]"
                                            : "cursor-pointer hover:shadow-[inset_hsl(var(--accent))_0_0_0_0.2rem]"
                                    }
                                `}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    navigate(`gates/${gate.id}`)
                                }}
                            />
                        )
                    case "up":
                        return (
                            <Button
                                key={`${gate.id}`}
                                className="absolute left-2 top-2 h-4 w-4 text-accent-foreground"
                                onClick={() =>
                                    navigate(`tiles/${gate.to_tile_id}`)
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
                                className="absolute bottom-2 left-2 h-4 w-4 text-accent-foreground"
                                onClick={() =>
                                    navigate(`tiles/${gate.to_tile_id}`)
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
            {mapTile.item_instances.length > 0 && (
                <CubeIcon className="absolute bottom-1 right-1 h-4 w-4 text-secondary-foreground" />
            )}
            {mapTile.character_instances.length > 0 && (
                <PersonIcon className="absolute right-1 top-1 h-4 w-4 text-secondary-foreground" />
            )}
        </div>
    )
}
