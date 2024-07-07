import type { LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/ui/layout/layout.tsx"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"
import { Card } from "~/ui/primitives/card.tsx"

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request)

    return superjson({ user })
}

export default function Route() {
    const { user } = useSuperLoaderData<typeof loader>()

    return (
        <Layout title="documentation" user={user}>
            <main className="p-4 [&>p]:mb-2">
                <p>
                    Create a text adventure by creating and linking together
                    different types of resources. The various resources are as
                    follows:
                </p>
                <Card className="my-8 bg-card p-8">
                    <dl className="grid grid-cols-[min-content_1fr] gap-x-8 gap-y-4 [&>dt]:text-accent-foreground">
                        <dt>grids</dt>
                        <dd>
                            A grid represents the whole text adventure, and
                            everything else falls under it.
                        </dd>
                        <hr className="col-span-2 mb-2 mt-4 opacity-50" />
                        <dt>tiles</dt>
                        <dd>
                            A tile represents a single area or room, that will
                            have its own description and show up as a single
                            tile on the world map.
                        </dd>
                        <hr className="col-span-2 mb-2 mt-4 opacity-50" />
                        <dt>characters</dt>
                        <dd>
                            A character represents an entity in the world that
                            can be added to tiles (they will appear there) and
                            can be given dialogue events.
                        </dd>
                        <hr className="col-span-2 mb-2 mt-4 opacity-50" />
                        <dt>items</dt>
                        <dd>
                            An item can be added to tiles or events, defining
                            how the player acquires them, and can also be linked
                            to locks, as a requirement for "unlocking" the lock.
                        </dd>
                        <hr className="col-span-2 mb-2 mt-4 opacity-50" />
                        <dt>events</dt>
                        <dd>
                            An event can be triggered by a character (e.g.
                            character dialogue) triggered by a specific tile
                            (during exploration), or triggered by moving through
                            a gate. Events can grant items, lock or unlock
                            locks, and can have a lock as a requirement to be
                            triggered. Also, events can have other events as
                            children, for creating dialogue trees or decision
                            trees.
                        </dd>
                        <hr className="col-span-2 mb-2 mt-4 opacity-50" />
                        <dt>gates</dt>
                        <dd>
                            A gate is the connection between two tiles. Adjacent
                            tiles can have two gates between them- each gate is
                            one way. each gate can trigger events, and be locked
                            by a lock.
                        </dd>
                        <hr className="col-span-2 mb-2 mt-4 opacity-50" />
                        <dt>locks</dt>
                        <dd>
                            A lock can be locked or unlocked by events, can be
                            unlocked by an item, and can be linked to gates and
                            events as a requirement. While it can be used
                            literally as a lock (whether a gate is locked or
                            unlocked) it can represent anything with two states,
                            such as whether a player has seen some other event
                            or dialogue. Use locks as flags for any content that
                            needs to be hidden or shown based on some condition.
                        </dd>
                    </dl>
                </Card>
                <p>
                    This is all very abstract, so to see how these pieces fit
                    together, let's go through an example.
                </p>
                <p className="mt-4 text-center text-muted-foreground">
                    [under construction]
                </p>
            </main>
        </Layout>
    )
}
