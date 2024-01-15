import { ThickArrowDownIcon, ThickArrowUpIcon } from "@radix-ui/react-icons"
import { TILE_DIMENSIONS } from "~/routes/write+/map/map.tsx"
import type { WriteTileWithCoords } from "~/routes/read+/processing.server.ts"
import { useNavigate, useParams } from "@remix-run/react"
import { paramsSchema } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"

export function MapTile({
    current,
    mapTile,
}: {
    current: boolean
    mapTile: WriteTileWithCoords
}) {
    const { resourceType, resourceId } = paramsSchema
        .partial()
        .parse(useParams())

    const navigate = useNavigate()

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
                        : `
                            cursor-pointer hover:shadow-[inset_hsl(var(--accent))_0_0_0_0.2rem]
                            has-[button:hover]:cursor-auto has-[div:hover]:cursor-auto
                            has-[button:hover]:shadow-none has-[div:hover]:shadow-none
                        `
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
                            <div
                                key={`${gate.id}`}
                                className={`absolute right-2 top-2 -m-0.5 h-5 w-5 rounded-none p-0.5 ${
                                    resourceId === gate.id
                                        ? "shadow-[inset_hsl(var(--accent))_0_0_0_0.2rem]"
                                        : "cursor-pointer hover:shadow-[inset_hsl(var(--accent))_0_0_0_0.2rem]"
                                } ${
                                    gate.lock_instances.length > 0
                                        ? "bg-secondary-foreground text-card"
                                        : "bg-card text-muted-foreground"
                                }`}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    navigate(`gates/${gate.id}`)
                                }}
                            >
                                <ThickArrowUpIcon className="h-full w-full" />
                            </div>
                        )
                    case "down":
                        return (
                            <div
                                key={`${gate.id}`}
                                className={`absolute bottom-2 right-2 -m-0.5 h-5 w-5 rounded-none p-0.5 ${
                                    resourceId === gate.id
                                        ? "shadow-[inset_hsl(var(--accent))_0_0_0_0.2rem]"
                                        : "cursor-pointer hover:shadow-[inset_hsl(var(--accent))_0_0_0_0.2rem]"
                                } ${
                                    gate.lock_instances.length > 0
                                        ? "bg-secondary-foreground text-card"
                                        : "bg-card text-muted-foreground"
                                }`}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    navigate(`gates/${gate.id}`)
                                }}
                            >
                                <ThickArrowDownIcon className="h-full w-full" />
                            </div>
                        )
                    default:
                        return null
                }
            })}
        </div>
    )
}
