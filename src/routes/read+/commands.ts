import type { IdMap, TileWithCoords } from "~/routes/read+/processing.server.ts"
import type { GridQuery } from "~/routes/read+/queries.server.ts"
import { defined, type Replace } from "~/lib/misc.ts"
import type { SaveData, useSaveData } from "~/lib/useSaveData.ts"
import type { InferSelectModel } from "drizzle-orm"
import type { requirements, events } from "~/database/schema/events.server.ts"

export const COMMANDS = {
    GO: "go",
    LOOK: "look",
    TAKE: "take",
    TALK: "talk",
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
        appendToCommandLog(command, "cleared data")
        return ""
    }

    if (saveData.currentEventId) {
        const event = eventIdMap[saveData.currentEventId]
        if (event.child_events.length === 0) {
            clearCommandLog()
            setSaveData("currentEventId", undefined)
            return ""
        }
        const triggeredEventId = event.child_events
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
                    const gate = currentTile.gates.find(
                        ({ type }) => type === commandTokens[1],
                    )
                    const { unfulfilledLocks, unfulfilledItems } =
                        splitRequirements(
                            saveData,
                            itemInstanceIdMap,
                            gate?.requirements || [],
                        )
                    if (unfulfilledLocks.length + unfulfilledItems.length > 0) {
                        appendToCommandLog(
                            command,
                            [...unfulfilledLocks, ...unfulfilledItems]
                                .map((requirement) => requirement.description)
                                .join(" ")
                                .trim() || "the way is shut",
                        )
                    } else if (gate) {
                        clearCommandLog()
                        setSaveData("currentTileId", gate.to_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
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
                    const gate = currentTile.gates.find(
                        ({ type }) => type === commandTokens[1],
                    )
                    const { unfulfilledLocks, unfulfilledItems } =
                        splitRequirements(
                            saveData,
                            itemInstanceIdMap,
                            gate?.requirements || [],
                        )
                    if (unfulfilledLocks.length + unfulfilledItems.length > 0) {
                        appendToCommandLog(
                            command,
                            [...unfulfilledLocks, ...unfulfilledItems]
                                .map((requirement) => requirement.description)
                                .join(" ")
                                .trim() || "the way is shut",
                        )
                    } else if (gate) {
                        appendToCommandLog(
                            command,
                            tileIdMap[gate.to_id].summary ||
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
                    const dialogue = character.dialogue.filter(
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
        case COMMANDS.EXPLORE:
            const events = currentTile.events.filter(
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
    for (const lock of triggeredEvent.unlocks_locks) {
        if (!saveData.unlocked.includes(lock.id)) {
            setSaveData("unlocked", [...saveData.unlocked, lock.id])
        }
    }
    for (const lock of triggeredEvent.locks_locks) {
        const index = saveData.unlocked.findIndex((id) => id === lock.id)
        if (index !== -1) {
            setSaveData("unlocked", [
                ...saveData.unlocked.slice(0, index),
                ...saveData.unlocked.slice(index + 1),
            ])
        }
    }
    for (const { item_id, consumes } of triggeredEvent.requirements) {
        if (item_id && consumes) {
            const index = saveData.heldItems.findIndex(
                (id) => itemInstanceIdMap[id].item_id === item_id,
            )
            if (index !== -1) {
                const itemInstanceId = saveData.heldItems[index]
                setSaveData("heldItems", [
                    ...saveData.heldItems.slice(0, index),
                    ...saveData.heldItems.slice(index + 1),
                ])
                if (!saveData.usedItems.includes(item_id)) {
                    setSaveData("usedItems", [
                        ...saveData.usedItems,
                        itemInstanceId,
                    ])
                }
            }
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
            eventIdMap[saveData.currentEventId].child_events
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
    return (eventWithoutRelations: InferSelectModel<typeof events>) => {
        const event = eventIdMap[eventWithoutRelations.id]

        for (const requirement of event.requirements) {
            if (requirement.lock_id) {
                const unlocked = saveData.unlocked.includes(requirement.lock_id)
                return requirement.inverse ? !unlocked : unlocked
            }

            if (requirement.item_id) {
                const hasItem = hasHeldItem(
                    saveData,
                    itemInstanceIdMap,
                    requirement.item_id,
                )
                return requirement.inverse ? !hasItem : hasItem
            }
        }

        return true
    }
}

function hasHeldItem(
    saveData: SaveData,
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
    item_id: GridQuery["items"][0]["id"],
) {
    return saveData.heldItems
        .map((instance_id) => itemInstanceIdMap[instance_id].item.id)
        .includes(item_id)
}

export function splitRequirements(
    saveData: SaveData,
    itemInstanceIdMap: IdMap<GridQuery["item_instances"][0]>,
    requirementsList: InferSelectModel<typeof requirements>[],
) {
    return requirementsList.reduce<{
        fulfilledItems: Replace<
            InferSelectModel<typeof requirements>,
            "item_id",
            number
        >[]
        unfulfilledItems: Replace<
            InferSelectModel<typeof requirements>,
            "item_id",
            number
        >[]
        fulfilledLocks: Replace<
            InferSelectModel<typeof requirements>,
            "lock_id",
            number
        >[]
        unfulfilledLocks: Replace<
            InferSelectModel<typeof requirements>,
            "lock_id",
            number
        >[]
    }>(
        (
            {
                fulfilledItems,
                unfulfilledItems,
                fulfilledLocks,
                unfulfilledLocks,
            },
            { item_id, lock_id, ...requirement },
        ) => {
            if (lock_id) {
                const unlocked = saveData.unlocked.includes(lock_id)
                if (
                    (unlocked && !requirement.inverse) ||
                    (!unlocked && requirement.inverse)
                ) {
                    fulfilledLocks.push({ ...requirement, item_id, lock_id })
                } else {
                    unfulfilledLocks.push({ ...requirement, item_id, lock_id })
                }
            } else if (item_id) {
                const hasItem = hasHeldItem(
                    saveData,
                    itemInstanceIdMap,
                    item_id,
                )
                if (
                    (hasItem && !requirement.inverse) ||
                    (!hasItem && requirement.inverse)
                ) {
                    fulfilledItems.push({ ...requirement, item_id, lock_id })
                } else {
                    unfulfilledItems.push({ ...requirement, item_id, lock_id })
                }
            }
            return {
                fulfilledItems,
                unfulfilledItems,
                fulfilledLocks,
                unfulfilledLocks,
            }
        },
        {
            fulfilledItems: [],
            unfulfilledItems: [],
            fulfilledLocks: [],
            unfulfilledLocks: [],
        },
    )
}
