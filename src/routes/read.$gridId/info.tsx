import { Tabs } from "@itsmapleleaf/radix-themes"

import { Card } from "~/components/card.tsx"
import type {
    CharactersSelectModel,
    ItemInstancesSelectModel,
    ItemsSelectModel,
} from "~/database/schema/grids.server.ts"
import { InfoData } from "~/routes/read.$gridId/infoData.tsx"
import { InfoStatus } from "~/routes/read.$gridId/infoStatus.tsx"
import { InfoTile } from "~/routes/read.$gridId/infoTile.tsx"
import type { IdMap, TileWithCoords } from "~/routes/read.$gridId/processing.ts"
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
    itemInstanceIdMap: IdMap<ItemInstancesSelectModel>
    player: CharactersSelectModel
    handleCommand: (command: string) => void
}) {
    return (
        <Card className="h-full bg-transparent pt-4">
            <Tabs.Root defaultValue="tile" className="h-full">
                <Tabs.Content value="tile" className="h-[calc(100%-3rem)]">
                    <InfoTile
                        saveData={saveData}
                        tileIdMap={tileIdMap}
                        handleCommand={handleCommand}
                    />
                </Tabs.Content>
                <Tabs.Content value="status" className="h-[calc(100%-3rem)]">
                    <InfoStatus
                        saveData={saveData}
                        player={player}
                        itemIdMap={itemIdMap}
                        itemInstanceIdMap={itemInstanceIdMap}
                        handleCommand={handleCommand}
                    />
                </Tabs.Content>
                <Tabs.Content value="data" className="h-[calc(100%-3rem)]">
                    <InfoData saveData={saveData} />
                </Tabs.Content>
                <Tabs.List className="absolute bottom-0 mx-4 mt-6 h-10 shadow-none">
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
            </Tabs.Root>
        </Card>
    )
}
