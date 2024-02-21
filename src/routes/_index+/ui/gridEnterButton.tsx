import { Pencil2Icon, PlayIcon } from "@radix-ui/react-icons"
import { ButtonWithIconLink } from "../../../ui/buttonWithIconLink.tsx"

export function GridEnterButton({
    gridId,
    canEdit,
}: {
    gridId: number
    canEdit: boolean
}) {
    return (
        <div className="flex min-h-9 w-[5.8rem] gap-2">
            {canEdit ? (
                <>
                    <ButtonWithIconLink
                        className="h-full flex-1"
                        variant="outline"
                        to={`/write/${gridId}`}
                        icon={Pencil2Icon}
                    />
                    <ButtonWithIconLink
                        className="h-full flex-1"
                        variant="outline"
                        to={`/read/${gridId}`}
                        icon={PlayIcon}
                    />
                </>
            ) : (
                <ButtonWithIconLink
                    className="h-full w-full flex-1"
                    variant="outline"
                    to={`/read/${gridId}`}
                    icon={PlayIcon}
                >
                    play
                </ButtonWithIconLink>
            )}
        </div>
    )
}
