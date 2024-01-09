import { Cross2Icon, EnterIcon } from "@radix-ui/react-icons"
import { useNavigate } from "@remix-run/react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { ActionBox } from "~/components/actionBox.tsx"
import { Card } from "~/components/ui/card.tsx"
import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/+$gridId.$resourceType.$resourceId.tsx"
import type { WriteTileQuery } from "~/routes/write+/queries.server.ts"

export function DetailsTilesItems() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteTileQuery

    const navigate = useNavigate()

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.item_instances.map(({ id, item }) => (
                    <Card
                        key={id}
                        className="mb-2 flex items-center px-2 py-1 shadow"
                    >
                        <span className="flex-1 px-2">{item.name}</span>
                        <ButtonIcon
                            icon={EnterIcon}
                            onClick={() => navigate(`items/${item.id}`)}
                        />
                        <ButtonIcon
                            icon={Cross2Icon}
                            onClick={() => {
                                console.debug("delete instance")
                            }}
                        />
                    </Card>
                )),
                <div key={"create"} className="flex">
                    <ActionBox
                        className="flex-1"
                        options={grid.items.map((item) => ({
                            id: item.id,
                            label: item.name,
                        }))}
                        onOptionSelect={({ id }) =>
                            console.debug(`add ${id} gate`)
                        }
                    >
                        add item
                    </ActionBox>
                </div>,
            ]}
        </Wait>
    )
}
