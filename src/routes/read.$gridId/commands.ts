import type { Dispatch, SetStateAction } from "react"
import type { TileIdMap } from "~/routes/read.$gridId/processing.ts"
import type { SaveData, useSaveData } from "~/utilities/useSaveData.ts"

export const COMMANDS = {
    GO: "go",
    LOOK: "look",
    TAKE: "take",
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
}

export function handleCommand(
    rawCommand: string,
    saveData: SaveData,
    tileIdMap: TileIdMap,
    setCommand: Dispatch<SetStateAction<string>>,
    appendToCommandLog: (command: string, message: string) => void,
    clearCommandLog: () => void,
    setSaveData: ReturnType<typeof useSaveData>[1],
) {
    const currentTile = tileIdMap[saveData.currentTileId]
    const command = rawCommand.toLowerCase().trim()
    const commandTokens = splitCommand(command)

    switch (commandTokens[0]) {
        case COMMANDS.GO:
            switch (commandTokens[1]) {
                case SUBCOMMANDS[COMMANDS.GO].NORTH:
                    if (currentTile.north_id) {
                        clearCommandLog()
                        setSaveData("currentTileId", currentTile.north_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].EAST:
                    if (currentTile.east_id) {
                        clearCommandLog()
                        setSaveData("currentTileId", currentTile.east_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].SOUTH:
                    if (currentTile.south_id) {
                        clearCommandLog()
                        setSaveData("currentTileId", currentTile.south_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].WEST:
                    if (currentTile.west_id) {
                        clearCommandLog()
                        setSaveData("currentTileId", currentTile.west_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].UP:
                    if (currentTile.up_id) {
                        clearCommandLog()
                        setSaveData("currentTileId", currentTile.up_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].DOWN:
                    if (currentTile.down_id) {
                        clearCommandLog()
                        setSaveData("currentTileId", currentTile.down_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                default:
                    handleUnrecognized(
                        rawCommand,
                        setCommand,
                        appendToCommandLog,
                    )
                    return
            }
            break
        case COMMANDS.LOOK:
            if (commandTokens.length === 1) {
                appendToCommandLog(
                    command,
                    currentTile.summary || "you don't see anything of interest",
                )
                break
            }
            switch (commandTokens[1]) {
                case SUBCOMMANDS[COMMANDS.GO].NORTH:
                    if (currentTile.north_id) {
                        appendToCommandLog(
                            command,
                            tileIdMap[currentTile.north_id].summary ||
                                "you don't see anything of interest",
                        )
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no exit in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].EAST:
                    if (currentTile.east_id) {
                        appendToCommandLog(
                            command,
                            tileIdMap[currentTile.east_id].summary ||
                                "you don't see anything of interest",
                        )
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no exit in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].SOUTH:
                    if (currentTile.south_id) {
                        appendToCommandLog(
                            command,
                            tileIdMap[currentTile.south_id].summary ||
                                "you don't see anything of interest",
                        )
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no exit in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].WEST:
                    if (currentTile.west_id) {
                        appendToCommandLog(
                            command,
                            tileIdMap[currentTile.west_id].summary ||
                                "you don't see anything of interest",
                        )
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no exit in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].UP:
                    if (currentTile.up_id) {
                        appendToCommandLog(
                            command,
                            tileIdMap[currentTile.up_id].summary ||
                                "you don't see anything of interest",
                        )
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no exit in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].DOWN:
                    if (currentTile.down_id) {
                        appendToCommandLog(
                            command,
                            tileIdMap[currentTile.down_id].summary ||
                                "you don't see anything of interest",
                        )
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no exit in that direction",
                        )
                    }
                    break
                default:
                    handleUnrecognized(
                        rawCommand,
                        setCommand,
                        appendToCommandLog,
                    )
                    return
            }
            break
        case COMMANDS.TAKE:
            handleUnrecognized(rawCommand, setCommand, appendToCommandLog)
            return
        default:
            handleUnrecognized(rawCommand, setCommand, appendToCommandLog)
            return
    }
    setCommand("")
}

function handleUnrecognized(
    command: string,
    setCommand: Dispatch<SetStateAction<string>>,
    appendToCommandLog: (command: string, message: string) => void,
) {
    if (command === "") {
        return
    }

    const available = availableCommands(command)
    if (available.length > 0) {
        setCommand(
            command
                .trimStart()
                .split(/\s+/)
                .slice(0, -1)
                .concat(available[0])
                .join(" ")
                .concat(" "),
        )
    } else {
        appendToCommandLog(command, "i did not understand that")
        setCommand("")
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