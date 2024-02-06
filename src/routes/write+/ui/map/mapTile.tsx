import {
    PlusIcon,
    ThickArrowDownIcon,
    ThickArrowUpIcon,
} from "@radix-ui/react-icons"
import { TILE_DIMENSIONS } from "~/routes/write+/ui/map/map.tsx"
import type { WriteTileWithCoords } from "~/routes/read+/lib/processing.server.ts"
import { useFetcher, useNavigate, useParams } from "@remix-run/react"
import { paramsSchema } from "~/routes/write+/$gridId+/$resourceType+/$resourceId+/_index.tsx"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"

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
    const fetcher = useFetcher()

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
                        return gate.active ? (
                            <div
                                key={`${gate.id}`}
                                className={`
                                    absolute z-10 before:absolute
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
                        ) : (
                            <ButtonWithIcon
                                icon={PlusIcon}
                                key={gate.id}
                                className={`
                                    absolute z-10 flex items-center justify-center
                                    p-1 before:absolute before:inset-0.5 before:rounded-sm ${
                                        {
                                            north: "-top-[1.2rem] left-0 right-0 mx-auto h-4 w-4 p-0",
                                            east: "-right-[1.2rem] bottom-0 top-0 my-auto h-4 w-4 p-0",
                                            south: "-bottom-[1.2rem] left-0 right-0 mx-auto h-4 w-4 p-0",
                                            west: "-left-[1.2rem] bottom-0 top-0 my-auto h-4 w-4 p-0",
                                        }[gate.type]
                                    }
                                `}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    fetcher.submit(null, {
                                        action: `gates/${gate.id}/enable`,
                                        method: "POST",
                                    })
                                }}
                            />
                        )
                    case "up":
                        return gate.active ? (
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
                        ) : (
                            <ButtonWithIcon
                                key={`${gate.id}`}
                                icon={PlusIcon}
                                className={
                                    "absolute right-2 top-2 -m-0.5 h-5 w-5 rounded-none p-0.5"
                                }
                                onClick={(event) => {
                                    event.stopPropagation()
                                    fetcher.submit(null, {
                                        action: `gates/${gate.id}/enable`,
                                        method: "POST",
                                    })
                                }}
                            />
                        )
                    case "down":
                        return gate.active ? (
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
                        ) : (
                            <ButtonWithIcon
                                key={`${gate.id}`}
                                icon={PlusIcon}
                                className={
                                    "absolute bottom-2 right-2 -m-0.5 h-5 w-5 rounded-none p-0.5"
                                }
                                onClick={(event) => {
                                    event.stopPropagation()
                                    fetcher.submit(null, {
                                        action: `gates/${gate.id}/enable`,
                                        method: "POST",
                                    })
                                }}
                            />
                        )
                    default:
                        return null
                }
            })}
        </div>
    )
}
