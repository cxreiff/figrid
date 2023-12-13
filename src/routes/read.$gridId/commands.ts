import type {
    IdMap,
    TileWithCoords,
} from "~/routes/read.$gridId/processing.server.ts"
import type { GridQuery } from "~/routes/read.$gridId/query.server.ts"
import type { SaveData, useSaveData } from "~/utilities/useSaveData.ts"

export const COMMANDS = {
    GO: "go",
    LOOK: "look",
    TAKE: "take",
    TALK: "talk",
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

    /* DEV COMMANDS */
    if (command === "drop items") {
        setSaveData("heldItems", [])
        appendToCommandLog(command, "cleared held items")
        return ""
    }

    if (command === "relock") {
        setSaveData("unlocked", [])
        appendToCommandLog(command, "restored locks")
        return ""
    }

    if (saveData.currentEventId) {
        const event = eventIdMap[saveData.currentEventId]
        if (event.child_events.length === 0) {
            clearCommandLog()
            setSaveData("currentEventId", undefined)
            return ""
        }
        const triggeredEvent = event.child_events.find(
            ({ trigger }) => trigger === command,
        )
        if (triggeredEvent) {
            clearCommandLog()
            setSaveData("currentEventId", triggeredEvent.id)
            if (
                triggeredEvent.unlock_lock_id &&
                !saveData.unlocked.includes(triggeredEvent.unlock_lock_id)
            ) {
                setSaveData("unlocked", [
                    ...saveData.unlocked,
                    triggeredEvent.unlock_lock_id,
                ])
            }
            if (triggeredEvent.lock_lock_id) {
                const index = saveData.unlocked.findIndex(
                    (id) => id === triggeredEvent.lock_lock_id,
                )
                if (index !== -1) {
                    setSaveData("unlocked", [
                        ...saveData.unlocked.slice(0, index),
                        ...saveData.unlocked.slice(index + 1),
                    ])
                }
            }
            return ""
        } else {
            appendToCommandLog(command, "not an option")
            return ""
        }
    }

    /* REAL COMMANDS */
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
                    const requirement = gate?.requirements.find(
                        ({ lock }) => !saveData.unlocked.includes(lock.id),
                    )
                    if (requirement) {
                        appendToCommandLog(
                            command,
                            requirement.summary || "the way is shut",
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
                    return handleUnrecognized(rawCommand, appendToCommandLog)
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
                    const requirement = gate?.requirements.find(
                        ({ lock }) => !saveData.unlocked.includes(lock.id),
                    )
                    if (requirement) {
                        appendToCommandLog(
                            command,
                            requirement.description || "the way is shut",
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
                    return handleUnrecognized(rawCommand, appendToCommandLog)
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
            return handleUnrecognized(rawCommand, appendToCommandLog)
        case COMMANDS.TALK:
            for (const character of currentTile.character_instances.map(
                ({ character }) => character,
            )) {
                if (
                    character.name.toLowerCase().trim() ===
                    commandTokens.slice(1).join(" ").trim()
                ) {
                    if (character.dialogue_event_id) {
                        clearCommandLog()
                        setSaveData(
                            "currentEventId",
                            character.dialogue_event_id,
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
        default:
            return handleUnrecognized(rawCommand, appendToCommandLog)
    }
}

function handleUnrecognized(
    command: string,
    appendToCommandLog: (command: string, message: string) => void,
) {
    if (command === "") {
        return ""
    }

    const available = availableCommands(command)
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

export function availableCommands(command: string) {
    const commandTokens = splitCommand(command.toLowerCase())

    if (commandTokens.length === 1) {
        return prefixFilter(Object.values(COMMANDS), commandTokens[0])
    }

    return (
        prefixFilter(
            Object.values(SUBCOMMANDS[commandTokens[0]] || {}),
            commandTokens[1],
        ) || []
    )
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
            .map(({ id, item }) => [id, item]),
    )
}
