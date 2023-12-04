import type { Dispatch, SetStateAction } from "react"
import type { TilesSelectModel } from "~/database/schema/grids.server.ts"

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
    },
    [COMMANDS.LOOK]: {},
    [COMMANDS.TAKE]: {},
}

export function handleCommand(
    rawCommand: string,
    tile: TilesSelectModel,
    setCommand: Dispatch<SetStateAction<string>>,
    appendToCommandLog: (command: string, message: string) => void,
    clearCommandLog: () => void,
    setCurrentTileId: Dispatch<SetStateAction<number>>,
) {
    const command = rawCommand.toLowerCase().trim()
    const commandTokens = splitCommand(command)

    switch (commandTokens[0]) {
        case COMMANDS.GO:
            switch (commandTokens[1]) {
                case SUBCOMMANDS[COMMANDS.GO].NORTH:
                    if (tile.north_id) {
                        clearCommandLog()
                        setCurrentTileId(tile.north_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].EAST:
                    if (tile.east_id) {
                        clearCommandLog()
                        setCurrentTileId(tile.east_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].SOUTH:
                    if (tile.south_id) {
                        clearCommandLog()
                        setCurrentTileId(tile.south_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                case SUBCOMMANDS[COMMANDS.GO].WEST:
                    if (tile.west_id) {
                        clearCommandLog()
                        setCurrentTileId(tile.west_id)
                    } else {
                        appendToCommandLog(
                            command,
                            "there is no passage in that direction",
                        )
                    }
                    break
                default:
                    handleUnrecognized(command, setCommand, appendToCommandLog)
                    return
            }
            break
        case COMMANDS.LOOK:
            switch (commandTokens[1]) {
                default:
                    appendToCommandLog(command, "not implemented yet")
            }
            break
        case COMMANDS.TAKE:
            switch (commandTokens[1]) {
                default:
                    appendToCommandLog(command, "not implemented yet")
            }
            break
        default:
            handleUnrecognized(command, setCommand, appendToCommandLog)
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
    const commandTokens = splitCommand(command)

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
