import { Tabs } from "@itsmapleleaf/radix-themes"
import { Card } from "~/components/card.tsx"
import type {
    CharactersSelectModel,
    ItemsSelectModel,
} from "~/database/schema/grids.server.ts"
import { InfoData } from "~/routes/read.$gridId/infoData.tsx"
import { InfoStatus } from "~/routes/read.$gridId/infoStatus.tsx"
import { InfoTile } from "~/routes/read.$gridId/infoTile.tsx"
import type {
    IdMap,
    ItemInstanceWithItem,
    TileWithCoords,
} from "~/routes/read.$gridId/processing.ts"
import type { SaveData } from "~/utilities/useSaveData.ts"

export function Info({
    saveData,
    tileIdMap,
    itemIdMap,
    itemInstanceIdMap,
    player,
    handleCommand,
}: {
    saveData?: SaveData
    tileIdMap: IdMap<TileWithCoords>
    itemIdMap: IdMap<ItemsSelectModel>
    itemInstanceIdMap: IdMap<ItemInstanceWithItem>
    player: CharactersSelectModel
    handleCommand: (command: string) => void
}) {
    return (
        <Tabs.Root defaultValue="tile" className="flex h-full flex-col gap-4">
            <Tabs.Content value="tile" className="h-[calc(100%-4rem)]">
                <InfoTile
                    saveData={saveData}
                    tileIdMap={tileIdMap}
                    handleCommand={handleCommand}
                />
            </Tabs.Content>
            <Tabs.Content value="status" className="h-[calc(100%-4rem)]">
                <InfoStatus
                    saveData={saveData}
                    player={player}
                    itemIdMap={itemIdMap}
                    itemInstanceIdMap={itemInstanceIdMap}
                    handleCommand={handleCommand}
                />
            </Tabs.Content>
            <Tabs.Content value="data" className="h-[calc(100%-4rem)]">
                <InfoData saveData={saveData} />
            </Tabs.Content>
            <Card className="no-card-padding h-[calc(3rem+1px)] bg-transparent">
                <Tabs.List className="mx-4 h-[calc(3rem+1px)] shadow-none">
                    <Tabs.Trigger value="tile" className="cursor-pointer">
                        tile
                    </Tabs.Trigger>
                    <Tabs.Trigger value="status" className="cursor-pointer">
                        status
                    </Tabs.Trigger>
                    <Tabs.Trigger value="data" className="cursor-pointer">
                        data
                    </Tabs.Trigger>
                </Tabs.List>
            </Card>
        </Tabs.Root>
    )
}
