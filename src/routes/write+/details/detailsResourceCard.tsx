import { Cross2Icon, EnterIcon } from "@radix-ui/react-icons"
import { useFetcher, useNavigate } from "@remix-run/react"
import type { ReactNode } from "react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { Card } from "~/components/ui/card.tsx"
import { cn } from "~/lib/misc.ts"

export function DetailsResourceCard<
    T extends { id: number; name: string; type?: string },
>({
    label,
    linkedResource,
    navigateUrl,
    unlinkUrl,
    actionSlot,
    inactive = false,
}: {
    label?: string
    linkedResource: T
    navigateUrl: string
    unlinkUrl?: string
    actionSlot?: ReactNode
    inactive?: boolean
}) {
    const navigate = useNavigate()
    const fetcher = useFetcher()

    return (
        <Card
            className={cn("mb-2 flex items-center p-1 shadow-sm", {
                "opacity-50": fetcher.state !== "idle",
                "border-dashed": inactive,
            })}
        >
            {label && (
                <span
                    className={cn(
                        "min-w-14 px-3 font-light text-muted-foreground",
                        {
                            "opacity-50": inactive,
                        },
                    )}
                >
                    {label}
                </span>
            )}
            <span
                className={cn("flex-1 px-3", {
                    "opacity-50": inactive,
                })}
            >
                {linkedResource.name}
            </span>
            <ButtonIcon
                icon={EnterIcon}
                onClick={() => navigate(navigateUrl)}
            />
            {actionSlot}
            {unlinkUrl && (
                <ButtonIcon
                    icon={Cross2Icon}
                    onClick={() => {
                        fetcher.submit(null, {
                            action: unlinkUrl,
                            method: "POST",
                        })
                    }}
                />
            )}
        </Card>
    )
}
