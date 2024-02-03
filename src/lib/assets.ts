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
