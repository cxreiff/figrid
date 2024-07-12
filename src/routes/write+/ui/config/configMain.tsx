import {
    DoubleArrowDownIcon,
    DoubleArrowUpIcon,
    FileIcon,
    ResetIcon,
} from "@radix-ui/react-icons"
import { withZod } from "@remix-validated-form/with-zod"
import { useState } from "react"
import { ValidatedForm } from "remix-validated-form"
import { z } from "zod"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import type { loader } from "~/routes/write+/$gridId+/_route.tsx"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { LayoutAccordion } from "~/ui/layout/layoutAccordion.tsx"
import { LayoutTitledScrolls } from "~/ui/layout/layoutTitledScrolls.tsx"
import { Card } from "~/ui/primitives/card.tsx"
import { ValidatedButton } from "~/ui/validated/validatedButton.tsx"
import { ValidatedInput } from "~/ui/validated/validatedInput.tsx"
import { ValidatedTextArea } from "~/ui/validated/validatedTextArea.tsx"
import { DetailsResourceCard } from "../details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "../details/detailsResourceLinker.tsx"

const formSchema = withZod(
    z.object({
        name: z.string().min(1, { message: "name is required" }).nullish(),
        summary: z.string().nullish(),
        description: z.string().nullish(),
    }),
)

export function ConfigMain() {
    const { grid } = useSuperLoaderData<typeof loader>()

    const [expanded, setExpanded] = useState<string[]>([])

    const accordionSection = {
        "information": (
            <ValidatedForm
                key={grid.id}
                validator={formSchema}
                method="POST"
                autoComplete="off"
                navigate={false}
                defaultValues={{
                    name: grid.name,
                    summary: grid.summary,
                    description: grid.description,
                }}
            >
                <ValidatedInput id="name" label="name" noAutocomplete />
                <ValidatedInput id="summary" label="summary" noAutocomplete />
                <ValidatedTextArea
                    id="description"
                    label="description"
                    noAutocomplete
                />
                <div className="mt-4 flex gap-4">
                    <ValidatedButton
                        type="reset"
                        variant="outline"
                        icon={ResetIcon}
                        className="flex-1"
                    >
                        revert
                    </ValidatedButton>
                    <ValidatedButton
                        type="submit"
                        variant="outline"
                        icon={FileIcon}
                        className="flex-1"
                    >
                        save
                    </ValidatedButton>
                </div>
            </ValidatedForm>
        ),
        "starting tile": (
            <div>
                <DetailsResourceCard
                    label="starting tile"
                    navigateUrl={`/write/${grid.id}/tiles/${grid.first_tile_id}`}
                    linkedResource={grid.first_tile}
                />
                <DetailsResourceLinker
                    id="first_tile"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/tiles/${id}/make_start`
                    }
                    options={grid.tiles}
                />
            </div>
        ),
    }

    return (
        <Card className="h-full p-4 pb-0">
            <LayoutTitledScrolls
                title="grid configuration"
                actionSlot={
                    expanded.length === Object.keys(accordionSection).length ? (
                        <ButtonWithIcon
                            icon={DoubleArrowUpIcon}
                            onClick={() => setExpanded([])}
                        />
                    ) : (
                        <ButtonWithIcon
                            icon={DoubleArrowDownIcon}
                            onClick={() =>
                                setExpanded(Object.keys(accordionSection))
                            }
                        />
                    )
                }
            >
                <LayoutAccordion expanded={expanded} setExpanded={setExpanded}>
                    {accordionSection}
                </LayoutAccordion>
            </LayoutTitledScrolls>
        </Card>
    )
}
