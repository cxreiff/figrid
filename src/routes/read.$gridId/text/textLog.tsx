import { TextTyper } from "~/components/textTyper.tsx"

export function TextLog({ commandLog }: { commandLog: string[] }) {
    return commandLog.map((message, index) => (
        <TextTyper
            key={index}
            className={"pb-6 " + (index % 2 ? undefined : "text-zinc-500")}
        >
            {message}
        </TextTyper>
    ))
}
