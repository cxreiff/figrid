import type { assets } from "~/database/schema/assets.server.ts"
import type { ValueOf } from "~/lib/misc.ts"
import { useRootLoaderData } from "~/lib/useRootLoaderData.ts"

export function useAssetUrl() {
    const {
        env: { R2_ASSETS_HOSTNAME },
    } = useRootLoaderData()

    const ASSET_FALLBACKS = {
        GRID_IMAGE: "grid.png",
        TILE_IMAGE: "tile.png",
        CHARACTER_IMAGE: "character.png",
    } as const

    function assetUrl(
        asset: typeof assets.$inferSelect | null,
        fallback?: ValueOf<typeof ASSET_FALLBACKS>,
    ): string {
        if (!asset) {
            if (!fallback) {
                return ""
            }
            return `${R2_ASSETS_HOSTNAME}/fallbacks/${fallback}`
        }
        const { grid_id, resource_type, asset_type, filename } = asset
        return `${R2_ASSETS_HOSTNAME}/grids/${grid_id}/${resource_type}/${asset_type}/${filename}`
    }

    return { assetUrl, ASSET_FALLBACKS }
}
