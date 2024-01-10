import { Wait } from "~/components/wait.tsx"
import { useSuperLoaderData, useSuperMatch } from "~/lib/superjson.ts"
import { type loader } from "~/routes/write+/+$gridId.tsx"
import { type loader as childLoader } from "~/routes/write+/$gridId+/+$resourceType.$resourceId.tsx"
import type { WriteTileQuery } from "~/routes/write+/queries.server.ts"
import { DetailsResourceCard } from "~/routes/write+/details/detailsResourceCard.tsx"
import { DetailsResourceLinker } from "~/routes/write+/details/detailsResourceLinker.tsx"

export function DetailsTilesCharacters() {
    const { grid } = useSuperLoaderData<typeof loader>()
    const resource = useSuperMatch<typeof childLoader>(
        "write.$gridId.$resourceType.$resourceId",
    )?.resource as WriteTileQuery

    return (
        <Wait on={resource}>
            {(resource) => [
                resource.character_instances.map(({ id, character }) => (
                    <DetailsResourceCard
                        key={id}
                        linkedResource={character}
                        navigateUrl={`characters/${character.id}`}
                        unlinkUrl={`/write/${grid.id}/tiles/${resource.id}/characters/${id}/unlink`}
                    />
                )),
                <DetailsResourceLinker
                    key="link"
                    getLinkUrl={(id) =>
                        `/write/${grid.id}/tiles/${resource.id}/characters/${id}/link`
                    }
                    options={grid.characters.filter(
                        (character) =>
                            character.id !== grid.player_id &&
                            !resource.character_instances.find(
                                ({ character_id }) =>
                                    character.id === character_id,
                            ),
                    )}
                />,
            ]}
        </Wait>
    )
}
