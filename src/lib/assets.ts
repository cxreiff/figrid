import { ASSET_RESOURCE_TYPES } from "~/database/enums.ts"
import type { assets } from "~/database/schema/assets.server.ts"
import type { ResourceType } from "~/routes/write+/$gridId+/_route.tsx"
import type {
    WriteCharacterQuery,
    WriteEventQuery,
    WriteGateQuery,
    WriteItemQuery,
    WriteLockQuery,
    WriteTileQuery,
} from "~/routes/write+/lib/queries.server.ts"

export function removeExtension(filename: string) {
    const extensionIndex = filename.lastIndexOf(".")
    return extensionIndex !== -1 ? filename.slice(0, extensionIndex) : filename
}

export function assetPrefix(
    gridId: number,
    resourceType: (typeof assets.$inferSelect)["resource_type"],
    assetType: (typeof assets.$inferSelect)["asset_type"],
) {
    return `grids/${gridId}/${resourceType}/${assetType}`
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
    return ASSET_RESOURCE_TYPES.includes(resourceType)
}
