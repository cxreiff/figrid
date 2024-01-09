import { Cross2Icon, EnterIcon } from "@radix-ui/react-icons"
import { useNavigate } from "@remix-run/react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { ActionBox } from "~/components/actionBox.tsx"
import { Card } from "~/components/ui/card.tsx"
import { Wait } from "~/components/wait.tsx"
import { useSuperMatch } from "~/lib/superjson.ts"
import type { loader } from "~/routes/write+/+$gridId.$resourceType.$resourceId.tsx"
import type { WriteTileQuery } from "~/routes/write+/queries.server.ts"

const GATE_OPTIONS = [
    { id: "north", label: "north" },
    { id: "east", label: "east" },
    { id: "south", label: "south" },
    { id: "west", label: "west" },
    { id: "up", label: "up" },
    { id: "down", label: "down" },
]

export function DetailsTilesGates() {
    const resource = useSuperMatch<typeof loader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteTileQuery

    const navigate = useNavigate()

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.gates.map(({ id, to }) => (
                    <Card key={id} className="mb-2 flex items-center px-2 py-1">
                        <span className="flex-1 px-2">{to.name}</span>
                        <ButtonIcon
                            icon={EnterIcon}
                            onClick={() => navigate(`tiles/${to.id}`)}
                        />
                        <ButtonIcon
                            icon={Cross2Icon}
                            onClick={() => {
                                console.debug("delete gate")
                            }}
                        />
                    </Card>
                )),
                <div key={"create"} className="flex">
                    <ActionBox
                        className="flex-1"
                        options={GATE_OPTIONS.filter(
                            (option) =>
                                !resource.gates.find(
                                    (gate) => gate.type === option.id,
                                ),
                        )}
                        onOptionSelect={({ id }) =>
                            console.debug(`add ${id} gate`)
                        }
                    >
                        add gate
                    </ActionBox>
                </div>,
            ]}
        </Wait>
    )
}
