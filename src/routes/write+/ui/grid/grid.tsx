import { Card } from "~/ui/primitives/card.tsx"
import type { loader } from "~/routes/write+/$gridId+/_route.tsx"
import { ValidatedForm } from "remix-validated-form"
import { useSuperLoaderData } from "~/lib/superjson.ts"
import { ValidatedInput } from "~/ui/validated/validatedInput.tsx"
import { z } from "zod"
import { withZod } from "@remix-validated-form/with-zod"
import {
    DoubleArrowDownIcon,
    DoubleArrowUpIcon,
    FileIcon,
    ResetIcon,
    TrashIcon,
} from "@radix-ui/react-icons"
import { ValidatedButton } from "~/ui/validated/validatedButton.tsx"
import { ValidatedTextArea } from "~/ui/validated/validatedTextArea.tsx"
import { LayoutAccordion } from "~/ui/layout/layoutAccordion.tsx"
import { DetailsResourceLinker } from "../details/detailsResourceLinker.tsx"
import { useState } from "react"
import { DetailsResourceCard } from "../details/detailsResourceCard.tsx"
import { LayoutTitledScrolls } from "~/ui/layout/layoutTitledScrolls.tsx"
import { Image } from "~/ui/image.tsx"
import { useAssetUrl } from "~/lib/useAssetUrl.ts"
import { ImageDropzone } from "~/ui/imageDropzone.tsx"
import { Form } from "@remix-run/react"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"

const formSchema = withZod(
    z.object({
        name: z.string().min(1, { message: "name is required" }).nullish(),
        summary: z.string().nullish(),
        description: z.string().nullish(),
    }),
)

export function Grid() {
    const { grid } = useSuperLoaderData<typeof loader>()

    const { assetUrl, ASSET_FALLBACKS } = useAssetUrl()

    const [expanded, setExpanded] = useState<string[]>([])

    const accordionSection = {
        "image": (
            <div className="relative h-full min-h-fit rounded-sm border bg-background p-2">
                {grid.image_asset ? (
                    <>
                        <Image
                            className="h-44"
                            src={assetUrl(
                                grid.image_asset,
                                ASSET_FALLBACKS.TILE_IMAGE,
                            )}
                            fade
                        />
                        <Form
                            className="absolute right-2 top-2"
                            action={`grids/${grid.id}/assets/images/${grid.image_asset_id}/delete`}
                            navigate={false}
                            method="POST"
                        >
                            <ButtonWithIcon
                                icon={TrashIcon}
                                type="submit"
                                className="bg-card hover:bg-accent"
                            />
                        </Form>
                    </>
                ) : (
                    <ImageDropzone
                        getActionUrl={(label) =>
                            `grids/${grid.id}/assets/images/${label}`
                        }
                    />
                )}
            </div>
        ),
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
