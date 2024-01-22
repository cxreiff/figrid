import type { assets } from "~/database/schema/assets.server.ts"

export const RESOURCE_TYPES_WITH_ASSETS = [
    "grid",
    "characters",
    "events",
    "items",
    "tiles",
] as const

export const ASSET_TYPES = ["images"] as const

export const GRID_ASSET_DOMAIN = "https://assets.figrid.io/grids"

export const TILE_FALLBACK_IMAGE = "https://assets.figrid.io/tiles/kitty.png"
export const PLAYER_FALLBACK_IMAGE = "https://assets.figrid.io/tiles/kitty.png"

export function assetUrl(asset: typeof assets.$inferSelect | null) {
    if (!asset) {
        return null
    }
    const { grid_id, resource_type, asset_type, filename } = asset
    return `${GRID_ASSET_DOMAIN}/${grid_id}/${resource_type}/${asset_type}/${filename}`
}
