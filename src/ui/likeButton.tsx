import { useFetcher } from "@remix-run/react"
import { ButtonWithIcon } from "./buttonWithIcon.tsx"
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons"

const LIKE_ACTION = "/actions/like"
const UNLIKE_ACTION = "/actions/unlike"

export function LikeButton({
    liked,
    likes,
    gridId,
}: {
    liked?: boolean
    likes: number
    gridId: number
}) {
    const fetcher = useFetcher()

    const optimisticLiked =
        fetcher.formAction?.startsWith(LIKE_ACTION) ||
        (!fetcher.formAction?.startsWith(UNLIKE_ACTION) && liked)

    return (
        <fetcher.Form
            method="POST"
            action={`${
                optimisticLiked ? UNLIKE_ACTION : LIKE_ACTION
            }/${gridId}`}
        >
            <ButtonWithIcon
                className="h-full [&>span]:pl-1.5"
                icon={optimisticLiked ? HeartFilledIcon : HeartIcon}
                type="submit"
                alignIcon="right"
                disabled={liked === undefined}
            >
                {likes}
            </ButtonWithIcon>
        </fetcher.Form>
    )
}
