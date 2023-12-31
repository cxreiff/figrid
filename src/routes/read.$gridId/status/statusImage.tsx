import { Image } from "~/components/image.tsx"
import { WaitSaveData } from "~/components/waitSaveData.tsx"
import type { loader } from "~/routes/read.$gridId/route.tsx"
import { PLAYER_FALLBACK_IMAGE } from "~/utilities/misc.ts"
import { useSuperLoaderData } from "~/utilities/superjson.ts"

export function StatusImage() {
    const { grid } = useSuperLoaderData<typeof loader>()
    return (
        <WaitSaveData className="h-full w-full">
            {() => {
                const image = grid.player.image_url || PLAYER_FALLBACK_IMAGE
                return (
                    <div className="flex h-full items-center justify-center">
                        <Image key={image} src={image} alt="placeholder" />
                    </div>
                )
            }}
        </WaitSaveData>
    )
}
