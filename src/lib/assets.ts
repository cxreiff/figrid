import type { assets } from "~/database/schema/assets.server.ts"
import type { ResourceType } from "~/routes/write+/+$gridId.tsx"
import type {
    WriteCharacterQuery,
    WriteEventQuery,
    WriteGateQuery,
    WriteItemQuery,
    WriteLockQuery,
    WriteTileQuery,
} from "~/routes/write+/lib/queries.server.ts"

export const RESOURCE_TYPES_WITH_ASSETS = [
    "characters",
    "events",
    "items",
    "tiles",
] as const

export const ASSET_TYPES = ["images"] as const

export const GRID_ASSET_DOMAIN = "https://assets.figrid.io/grids"

export const GRID_FALLBACK_IMAGE = "https://assets.figrid.io/fallbacks/grid.png"
export const TILE_FALLBACK_IMAGE = "https://assets.figrid.io/fallbacks/tile.png"
export const PLAYER_FALLBACK_IMAGE =
    "https://assets.figrid.io/fallbacks/character.png"

type AssetUrlReturn<T extends typeof assets.$inferSelect | null> =
    T extends typeof assets.$inferSelect ? string : null

export function assetUrl<T extends typeof assets.$inferSelect | null>(
    asset: T,
): AssetUrlReturn<T> {
    if (!asset) {
        return null as AssetUrlReturn<T>
    }
    const { grid_id, resource_type, asset_type, filename } = asset
    return `${GRID_ASSET_DOMAIN}/${grid_id}/${resource_type}/${asset_type}/${filename}` as AssetUrlReturn<T>
}

export function removeExtension(filename: string) {
    const extensionIndex = filename.lastIndexOf(".")
    return extensionIndex !== -1 ? filename.slice(0, extensionIndex) : filename
}

export function canHaveImageAsset(
    _:
        | WriteCharacterQuery
        | WriteEventQuery
        | WriteGateQuery
        | WriteItemQuery
        | WriteTileQuery
        | WriteLockQuery,
    resourceType: ResourceType,
): _ is
    | WriteCharacterQuery
    | WriteEventQuery
    | WriteItemQuery
    | WriteTileQuery {
    return RESOURCE_TYPES_WITH_ASSETS.includes(resourceType)
}
