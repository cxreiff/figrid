import { Cross2Icon, EnterIcon } from "@radix-ui/react-icons"
import { useFetcher, useNavigate } from "@remix-run/react"
import { ButtonIcon } from "~/components/buttonIcon.tsx"
import { Card } from "~/components/ui/card.tsx"
import { cn } from "~/lib/misc.ts"

export function DetailsResourceCard<
    T extends { id: number; name: string; type?: string },
>({
    linkedResource,
    navigateUrl,
    unlinkUrl,
}: {
    linkedResource: T
    navigateUrl: string
    unlinkUrl?: string
}) {
    const navigate = useNavigate()
    const fetcher = useFetcher()

    return (
        <Card
            className={cn("mb-2 flex items-center p-1 shadow-sm", {
                "opacity-50": fetcher.state !== "idle",
            })}
        >
            {linkedResource.type && (
                <span className="w-14 px-3 text-muted-foreground">
                    {linkedResource.type}
                </span>
            )}
            <span className="flex-1 px-3">{linkedResource.name}</span>
            <ButtonIcon
                icon={EnterIcon}
                onClick={() => navigate(navigateUrl)}
            />
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
