import type {
    IdMap,
    TileWithCoords,
} from "~/routes/read+/lib/processing.server.ts"
import type { GridQuery } from "~/routes/read+/lib/queries.server.ts"
import { defined } from "~/lib/misc.ts"
import type { SaveData, useSaveData } from "~/lib/useSaveData.ts"
import type { InferSelectModel } from "drizzle-orm"
import { type events } from "~/database/schema/events.server.ts"

export const COMMANDS = {
    GO: "go",
    LOOK: "look",
    TAKE: "take",
    TALK: "talk",
    USE: "use",
    EXPLORE: "explore",
}

export const SUBCOMMANDS = {
    [COMMANDS.GO]: {
        NORTH: "north",
        EAST: "east",
        SOUTH: "south",
        WEST: "west",
        UP: "up",
        DOWN: "down",
    },
    [COMMANDS.LOOK]: {
        NORTH: "north",
        EAST: "east",
        SOUTH: "south",
        WEST: "west",
        UP: "up",
        DOWN: "down",
    },
    [COMMANDS.TAKE]: {},
    [COMMANDS.TALK]: {},
    [COMMANDS.USE]: {},
    [COMMANDS.EXPLORE]: {},
}

export function handleCommand(
    rawCommand: string,
    saveData: SaveData,
    tileIdMap: IdMap<TileWithCoords>,
    eventIdMap: IdMap<GridQuery["events"][0]>,
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
    appendToCommandLog: (command: string, message: string) => void,
    clearCommandLog: () => void,
    setSaveData: ReturnType<typeof useSaveData>[1],
) {
    const currentTile = tileIdMap[saveData.currentTileId]
    const command = rawCommand.toLowerCase().trim()
    const commandTokens = splitCommand(command)

    if (command === "reset") {
        setSaveData("heldItems", [])
        setSaveData("usedItems", [])
        setSaveData("unlocked", [])
        setSaveData("unlockedInstances", [])
        appendToCommandLog(command, "cleared data")
        return ""
    }

    if (saveData.currentEventId) {
        const event = eventIdMap[saveData.currentEventId]
        if (
            event.children.filter(({ trigger }) => trigger != null).length === 0
        ) {
            clearCommandLog()
            setSaveData("currentEventId", undefined)
            return ""
        }
        const triggeredEventId = event.children
            .filter(
                getQualifiedEventsFilter(
                    saveData,
                    itemInstanceIdMap,
                    eventIdMap,
                ),
            )
            .find(({ trigger }) => trigger === command)?.id
        if (triggeredEventId) {
            return handleTriggeredEvent(
                triggeredEventId,
                saveData,
                eventIdMap,
                itemInstanceIdMap,
                clearCommandLog,
                setSaveData,
            )
        } else {
            return handleUnrecognized(
                command,
                currentTile,
                saveData,
                eventIdMap,
                itemInstanceIdMap,
                appendToCommandLog,
            )
        }
    }

    switch (commandTokens[0]) {
        case COMMANDS.GO:
            switch (commandTokens[1]) {
                case SUBCOMMANDS[COMMANDS.GO].NORTH:
                case SUBCOMMANDS[COMMANDS.GO].EAST:
                case SUBCOMMANDS[COMMANDS.GO].SOUTH:
                case SUBCOMMANDS[COMMANDS.GO].WEST:
                case SUBCOMMANDS[COMMANDS.GO].UP:
                case SUBCOMMANDS[COMMANDS.GO].DOWN:
                    const gate = currentTile.gates_out.find(
                        ({ type }) => type === commandTokens[1],
                    )

                    if (!gate) {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                        return ""
                    }

                    const { unfulfilled } = splitLockInstances(
                        gate?.lock_instances || [],
                        saveData,
                    )

                    if (unfulfilled.length > 0) {
                        appendToCommandLog(
                            command,
                            unfulfilled
                                .map(({ lock }) => lock.description)
                                .join(" ")
                                .trim() || "the way is shut",
                        )
                        return ""
                    }

                    clearCommandLog()
                    setSaveData("currentTileId", gate.to_tile_id)
                    if (!saveData.visited.includes(gate.to_tile_id)) {
                        setSaveData("visited", [
                            ...saveData.visited,
                            gate.to_tile_id,
                        ])
                    }

                    const gateEvents = gate.event_instances
                        .map(({ event }) => event)
                        .filter(
                            getQualifiedEventsFilter(
                                saveData,
                                itemInstanceIdMap,
                                eventIdMap,
                            ),
                        )
                    if (gateEvents.length > 0) {
                        return handleTriggeredEvent(
                            gate.event_instances[
                                Math.floor(Math.random() * gateEvents.length)
                            ].event_id,
                            saveData,
                            eventIdMap,
                            itemInstanceIdMap,
                            clearCommandLog,
                            setSaveData,
                        )
                    }
                    return ""
                default:
                    return handleUnrecognized(
                        rawCommand,
                        currentTile,
                        saveData,
                        eventIdMap,
                        itemInstanceIdMap,
                        appendToCommandLog,
                    )
            }
        case COMMANDS.LOOK:
            if (commandTokens.length === 1) {
                appendToCommandLog(
                    command,
                    currentTile.summary || "you don't see anything of interest",
                )
                return ""
            }
            let lookables: Array<
                | GridQuery["items"][0]
                | GridQuery["tiles"][0]["character_instances"][0]["character"]
            >
            lookables = Object.values(
                availableItemsMap(currentTile, saveData),
            ).concat(
                saveData.heldItems.map(
                    (instanceId) => itemInstanceIdMap[instanceId].item,
                ),
            )
            lookables = lookables.concat(
                currentTile.character_instances.map(
                    ({ character }) => character,
                ),
            )
            for (const lookable of lookables) {
                if (
                    lookable.name.toLowerCase().trim() ===
                    commandTokens.slice(1).join(" ").trim()
                ) {
                    appendToCommandLog(
                        command,
                        lookable.description || "you notice nothing of note",
                    )
                    return ""
                }
            }
            switch (commandTokens[1]) {
                case SUBCOMMANDS[COMMANDS.LOOK].NORTH:
                case SUBCOMMANDS[COMMANDS.LOOK].EAST:
                case SUBCOMMANDS[COMMANDS.LOOK].SOUTH:
                case SUBCOMMANDS[COMMANDS.LOOK].WEST:
                case SUBCOMMANDS[COMMANDS.LOOK].UP:
                case SUBCOMMANDS[COMMANDS.LOOK].DOWN:
                    const gate = currentTile.gates_out.find(
                        ({ type }) => type === commandTokens[1],
                    )

                    const { unfulfilled } = splitLockInstances(
                        gate?.lock_instances || [],
                        saveData,
                    )

                    if (unfulfilled.length > 0) {
                        appendToCommandLog(
                            command,
                            unfulfilled
                                .map(({ lock }) => lock.description)
                                .join(" ")
                                .trim() || "the way is shut",
                        )
                    } else if (gate) {
                        appendToCommandLog(
                            command,
                            gate.summary ||
                                "you don't see anything of interest",
                        )
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no exit in that direction",
                        )
                    }
                    return ""
                default:
                    return handleUnrecognized(
                        rawCommand,
                        currentTile,
                        saveData,
                        eventIdMap,
                        itemInstanceIdMap,
                        appendToCommandLog,
                    )
            }
        case COMMANDS.TAKE:
            for (const [instanceId, item] of Object.entries(
                availableItemsMap(currentTile, saveData),
            )) {
                if (
                    item.name.toLowerCase().trim() ===
                    commandTokens.slice(1).join(" ").trim()
                ) {
                    setSaveData("heldItems", [
                        ...saveData.heldItems,
                        Number(instanceId),
                    ])
                    appendToCommandLog(command, `you take the ${item.name}`)
                    return ""
                }
            }
            return handleUnrecognized(
                rawCommand,
                currentTile,
                saveData,
                eventIdMap,
                itemInstanceIdMap,
                appendToCommandLog,
            )
        case COMMANDS.TALK:
            for (const character of currentTile.character_instances.map(
                ({ character }) => character,
            )) {
                if (
                    character.name.toLowerCase().trim() ===
                    commandTokens.slice(1).join(" ").trim()
                ) {
                    const dialogue = character.event_instances
                        .map(({ event }) => event)
                        .filter(
                            getQualifiedEventsFilter(
                                saveData,
                                itemInstanceIdMap,
                                eventIdMap,
                            ),
                        )
                    if (dialogue.length > 0) {
                        return handleTriggeredEvent(
                            dialogue[
                                Math.floor(Math.random() * dialogue.length)
                            ].id,
                            saveData,
                            eventIdMap,
                            itemInstanceIdMap,
                            clearCommandLog,
                            setSaveData,
                        )
                    } else {
                        appendToCommandLog(
                            command,
                            "they do not have much to say",
                        )
                    }
                    return ""
                }
            }
        case COMMANDS.USE:
            const itemInstanceId = saveData.heldItems.find(
                (instanceId) =>
                    itemInstanceIdMap[instanceId]?.item.name
                        .toLowerCase()
                        .trim() === commandTokens.slice(1).join(" ").trim(),
            )

            if (itemInstanceId) {
                const itemInstance = itemInstanceIdMap[itemInstanceId]
                const unlockableLockInstance = currentTile.gates_out
                    .flatMap(({ lock_instances }) => lock_instances)
                    .find(
                        ({ lock }) =>
                            lock.required_item_id === itemInstance.item_id,
                    )
                if (unlockableLockInstance) {
                    setSaveData("unlockedInstances", [
                        ...saveData.unlockedInstances,
                        unlockableLockInstance.id,
                    ])
                    if (unlockableLockInstance.lock.consumes) {
                        exhaustItem(
                            itemInstance.item.id,
                            saveData,
                            setSaveData,
                            itemInstanceIdMap,
                        )
                    }
                    appendToCommandLog(
                        command,
                        `used ${itemInstance.item.name} on the ${
                            `${unlockableLockInstance.gate?.type} ` || ""
                        }exit`,
                    )
                    return ""
                }
            }

            return handleUnrecognized(
                rawCommand,
                currentTile,
                saveData,
                eventIdMap,
                itemInstanceIdMap,
                appendToCommandLog,
            )
        case COMMANDS.EXPLORE:
            const events = currentTile.event_instances
                .map(({ event }) => event)
                .filter(
                    getQualifiedEventsFilter(
                        saveData,
                        itemInstanceIdMap,
                        eventIdMap,
                    ),
                )
            if (events.length > 0) {
                return handleTriggeredEvent(
                    events[Math.floor(Math.random() * events.length)].id,
                    saveData,
                    eventIdMap,
                    itemInstanceIdMap,
                    clearCommandLog,
                    setSaveData,
                )
            } else {
                appendToCommandLog(command, "there is little to explore here")
            }
            return ""
        default:
            return handleUnrecognized(
                rawCommand,
                currentTile,
                saveData,
                eventIdMap,
                itemInstanceIdMap,
                appendToCommandLog,
            )
    }
}

function handleUnrecognized(
    command: string,
    currentTile: TileWithCoords,
    saveData: SaveData,
    eventIdMap: IdMap<GridQuery["events"][0]>,
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
    appendToCommandLog: (command: string, message: string) => void,
) {
    if (command === "") {
        return ""
    }

    const available = availableCommands(
        command,
        currentTile,
        saveData,
        eventIdMap,
        itemInstanceIdMap,
    )
    if (available.length > 0) {
        return command
            .trimStart()
            .split(/\s+/)
            .slice(0, -1)
            .concat(available[0])
            .join(" ")
            .concat(" ")
    } else {
        appendToCommandLog(command, "i did not understand that")
        return ""
    }
}

function handleTriggeredEvent(
    eventId: number,
    saveData: SaveData,
    eventIdMap: IdMap<GridQuery["events"][0]>,
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
    clearCommandLog: () => void,
    setSaveData: ReturnType<typeof useSaveData>[1],
) {
    const triggeredEvent = eventIdMap[eventId]
    clearCommandLog()
    setSaveData("currentEventId", triggeredEvent.id)

    if (
        triggeredEvent.triggers_unlock &&
        !saveData.unlocked.includes(triggeredEvent.triggers_unlock.id)
    ) {
        setSaveData("unlocked", [
            ...saveData.unlocked,
            triggeredEvent.triggers_unlock.id,
        ])
    }

    if (triggeredEvent.triggers_lock) {
        const index = saveData.unlocked.findIndex(
            (id) => id === triggeredEvent.triggers_lock?.id,
        )
        if (index !== -1) {
            setSaveData("unlocked", [
                ...saveData.unlocked.slice(0, index),
                ...saveData.unlocked.slice(index + 1),
            ])
        }
    }

    for (const { lock } of triggeredEvent.lock_instances) {
        if (lock.required_item_id && lock.consumes) {
            exhaustItem(
                lock.required_item_id,
                saveData,
                setSaveData,
                itemInstanceIdMap,
            )
        }
    }

    for (const itemInstance of triggeredEvent.item_instances) {
        if (!saveData.heldItems.includes(itemInstance.id)) {
            setSaveData("heldItems", [...saveData.heldItems, itemInstance.id])
        }
    }

    return ""
}

export function availableCommands(
    command: string,
    currentTile: TileWithCoords,
    saveData: SaveData,
    eventIdMap: IdMap<GridQuery["events"][0]>,
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
) {
    const commandTokens = splitCommand(command.toLowerCase())

    if (saveData.currentEventId) {
        return prefixFilter(
            eventIdMap[saveData.currentEventId].children
                .filter(
                    getQualifiedEventsFilter(
                        saveData,
                        itemInstanceIdMap,
                        eventIdMap,
                    ),
                )
                .map((event) => event.trigger)
                .filter(defined),
            command,
        )
    }

    if (commandTokens.length === 1) {
        return prefixFilter(Object.values(COMMANDS), commandTokens[0])
    }

    let targets = Object.values(SUBCOMMANDS[commandTokens[0]] || {})

    if (
        commandTokens[0] === COMMANDS.TAKE ||
        commandTokens[0] === COMMANDS.LOOK
    ) {
        targets = targets.concat(
            Object.values(availableItemsMap(currentTile, saveData)).map(
                (item) => item.name,
            ),
        )
    }

    if (commandTokens[0] === COMMANDS.LOOK) {
        targets = targets.concat(
            currentTile.character_instances.map(
                (instance) => instance.character.name,
            ),
        )
    }

    return prefixFilter(targets, commandTokens.slice(1).join(" "))
}

function splitCommand(command: string) {
    return command.trimStart().split(/\s+/)
}

function prefixFilter(available: string[], commandToken: string) {
    return available.filter((suggestion) => suggestion.startsWith(commandToken))
}

export function availableItemsMap(tile: TileWithCoords, saveData: SaveData) {
    return Object.fromEntries(
        tile.item_instances
            .filter(({ id }) => !saveData.heldItems.includes(id))
            .filter(({ id }) => !saveData.usedItems.includes(id))
            .map(({ id, item }) => [id, item]),
    )
}

function getQualifiedEventsFilter(
    saveData: SaveData,
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
    eventIdMap: IdMap<GridQuery["events"][0]>,
) {
    return (possibleEvent: InferSelectModel<typeof events>) => {
        const event = eventIdMap[possibleEvent.id]

        for (const lockInstance of event.lock_instances) {
            if (!isLockFulfilled(lockInstance, saveData)) {
                if (
                    !hasHeldItem(
                        lockInstance.lock.required_item_id,
                        saveData,
                        itemInstanceIdMap,
                    )
                ) {
                    return false
                }
            }
        }

        return true
    }
}

function isLockFulfilled(
    lockInstance: GridQuery["events"][0]["lock_instances"][0],
    saveData: SaveData,
) {
    const unlocked =
        saveData.unlocked.includes(lockInstance.lock.id) ||
        saveData.unlockedInstances.includes(lockInstance.id)

    return unlocked !== lockInstance.inverse
}

export function splitLockInstances(
    lockInstances:
        | GridQuery["events"][0]["lock_instances"]
        | GridQuery["tiles"][0]["gates_out"][0]["lock_instances"],
    saveData: SaveData,
) {
    return lockInstances.reduce<{
        fulfilled: GridQuery["events"][0]["lock_instances"][0][]
        unfulfilled: GridQuery["events"][0]["lock_instances"][0][]
    }>(
        ({ fulfilled, unfulfilled }, lockInstance) => {
            return isLockFulfilled(lockInstance, saveData)
                ? {
                      fulfilled: [...fulfilled, lockInstance],
                      unfulfilled,
                  }
                : {
                      fulfilled,
                      unfulfilled: [...unfulfilled, lockInstance],
                  }
        },
        { fulfilled: [], unfulfilled: [] },
    )
}

export function splitUnfulfilledLockInstances(
    lockInstances:
        | GridQuery["events"][0]["lock_instances"]
        | GridQuery["tiles"][0]["gates_out"][0]["lock_instances"],
    saveData: SaveData,
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
) {
    return lockInstances.reduce<{
        holdingItem: GridQuery["events"][0]["lock_instances"][0][]
        missingItem: GridQuery["events"][0]["lock_instances"][0][]
        noItem: GridQuery["events"][0]["lock_instances"][0][]
    }>(
        ({ holdingItem, missingItem, noItem }, lockInstance) => {
            if (!lockInstance.lock.required_item_id) {
                return {
                    holdingItem,
                    missingItem,
                    noItem: [...noItem, lockInstance],
                }
            }
            return hasHeldItem(
                lockInstance.lock.required_item_id,
                saveData,
                itemInstanceIdMap,
            )
                ? {
                      holdingItem: [...holdingItem, lockInstance],
                      missingItem,
                      noItem,
                  }
                : {
                      holdingItem,
                      missingItem: [...missingItem, lockInstance],
                      noItem,
                  }
        },
        { holdingItem: [], missingItem: [], noItem: [] },
    )
}

function hasHeldItem(
    itemId: GridQuery["items"][0]["id"] | null,
    saveData: SaveData,
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
) {
    if (itemId === null) {
        return false
    }

    return saveData.heldItems
        .map((instance_id) => itemInstanceIdMap[instance_id].item.id)
        .includes(itemId)
}

function exhaustItem(
    itemId: number,
    saveData: SaveData,
    setSaveData: ReturnType<typeof useSaveData>[1],
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
) {
    const index = saveData.heldItems.findIndex(
        (instanceId) => itemInstanceIdMap[instanceId].item_id === itemId,
    )
    if (index !== -1) {
        const itemInstanceId = saveData.heldItems[index]
        setSaveData("heldItems", [
            ...saveData.heldItems.slice(0, index),
            ...saveData.heldItems.slice(index + 1),
        ])
        if (!saveData.usedItems.includes(itemInstanceId)) {
            setSaveData("usedItems", [...saveData.usedItems, itemInstanceId])
        }
    }
}
