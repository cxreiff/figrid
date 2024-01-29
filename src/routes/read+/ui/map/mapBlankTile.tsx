import { TILE_DIMENSIONS } from "~/routes/read+/ui/map/map.tsx"

export function BlankTile({ handleClick }: { handleClick?: () => void }) {
    return (
        <div
            style={{
                width: `${TILE_DIMENSIONS.x}rem`,
                height: `${TILE_DIMENSIONS.y}rem`,
            }}
            className={`relative border border-dashed border-muted-foreground opacity-50 ${
                handleClick
                    ? "cursor-pointer transition-colors duration-500 before:absolute before:inset-2 before:rounded-md before:bg-transparent hover:before:bg-[hsla(var(--accent)/0.4)]"
                    : ""
            }`}
            onClick={handleClick}
        />
    )
}
