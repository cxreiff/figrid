import { Cross2Icon, EnterIcon } from "@radix-ui/react-icons"
import { useFetcher, useNavigate } from "@remix-run/react"
import type { PropsWithChildren, ReactNode } from "react"
import { ButtonWithIcon } from "~/ui/buttonWithIcon.tsx"
import { Card } from "~/ui/primitives/card.tsx"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/ui/primitives/collapsible.tsx"
import { cn, type IconType } from "~/lib/misc.ts"

export function DetailsResourceCard<
    T extends { id: number; name: string; type?: string },
>({
    children,
    label,
    linkedResource,
    navigateUrl,
    unlinkUrl,
    indicatorIcons,
    actionSlot,
    inactive = false,
}: PropsWithChildren<{
    label?: string
    linkedResource: T
    navigateUrl: string
    unlinkUrl?: string
    indicatorIcons?: IconType[]
    actionSlot?: ReactNode
    inactive?: boolean
}>) {
    const navigate = useNavigate()
    const fetcher = useFetcher()

    const resourceDetails = (
        <div className="flex w-full items-center p-1">
            {label && (
                <span
                    className={cn(
                        "min-w-16 px-3 font-light text-muted-foreground",
                        {
                            "opacity-50": inactive,
                        },
                    )}
                >
                    {label}
                </span>
            )}
            <span
                className={cn("inline flex-1 px-3", {
                    "opacity-50": inactive,
                })}
            >
                {linkedResource.name}
                {indicatorIcons &&
                    indicatorIcons.map((Icon, index) => (
                        <Icon
                            key={index}
                            className="ml-2 inline h-3 text-muted-foreground"
                        />
                    ))}
            </span>
            <ButtonWithIcon
                icon={EnterIcon}
                onClick={(event) => {
                    event.stopPropagation()
                    navigate(navigateUrl)
                }}
            />
            {actionSlot}
            {unlinkUrl && (
                <ButtonWithIcon
                    icon={Cross2Icon}
                    onClick={(event) => {
                        event.stopPropagation()
                        fetcher.submit(null, {
                            action: unlinkUrl,
                            method: "POST",
                        })
                    }}
                />
            )}
        </div>
    )

    return (
        <Card
            className={cn("mb-2 shadow-sm", {
                "opacity-50": fetcher.state !== "idle",
                "border-dashed": inactive,
            })}
        >
            {children ? (
                <Collapsible>
                    <CollapsibleTrigger>{resourceDetails}</CollapsibleTrigger>
                    <CollapsibleContent>{children}</CollapsibleContent>
                </Collapsible>
            ) : (
                resourceDetails
            )}
        </Card>
    )
}
