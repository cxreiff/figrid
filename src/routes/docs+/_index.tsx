import type { LoaderFunctionArgs } from "@vercel/remix"
import { auth } from "~/auth/auth.server.ts"
import { Layout } from "~/ui/layout/layout.tsx"
import { superjson, useSuperLoaderData } from "~/lib/superjson.ts"

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await auth.isAuthenticated(request)

    return superjson({ user })
}

export default function Route() {
    const { user } = useSuperLoaderData<typeof loader>()

    return (
        <Layout title="documentation" user={user}>
            <header>
                <h3>help and documentation</h3>
            </header>
            <main>
                <h4>creation</h4>
                <p>
                    create a text adventure by creating and linking together
                    different types of resources.
                </p>
                <p>The various resources are as follows:</p>
                <p>
                    <dl>
                        <dt>grids</dt>
                        <dd>
                            a grid represents the whole text adventure, and
                            everything else falls under it.
                        </dd>
                        <dt>tiles</dt>
                        <dd>
                            a tile represents a single area or room, that will
                            have its own description and show up as a single
                            tile on the world map.
                        </dd>
                        <dt>characters</dt>
                        <dd>
                            a character represents an entity in the world that
                            can be added to tiles (they will appear there) and
                            can be given items and dialogue.
                        </dd>
                        <dt>items</dt>
                        <dd>
                            an item can be added to tiles or events, defining
                            how the player acquires them, and can also be linked
                            to locks, as a requirement for "unlocking" the lock.
                        </dd>
                        <dt>events</dt>
                        <dd>
                            an event can be triggered by a character (e.g.
                            character dialogue) triggered by a specific tile
                            (during exploration), or triggered by a gate. events
                            can grant items, lock or unlock locks, and can have
                            a lock as a requirement to be triggered. also,
                            events can have other events as children, for
                            creating dialogue trees or decision trees.
                        </dd>
                        <dt>gates</dt>
                        <dd>
                            a gate is the connection between two tiles. adjacent
                            tiles can have two gates between them- each gate is
                            one way. each gate can trigger events, and be locked
                            by a lock.
                        </dd>
                        <dt>locks</dt>
                        <dd>
                            a lock can be locked or unlocked by events, can be
                            unlocked by an item, and can be linked to gates and
                            events as a requirement. while it can be used
                            literally as a lock (whether a gate is locked or
                            unlocked) it can represent anything with two states,
                            such as whether a player has seen some other event
                            or dialogue. use locks as flags for any time content
                            needs to be hidden or shown based on some condition.
                        </dd>
                    </dl>
                    <p>
                        this is all very abstract, so to see how these pieces
                        fit together, let's go through an example.
                    </p>
                    <p>[example to be written]</p>
                </p>
            </main>
        </Layout>
    )
}
