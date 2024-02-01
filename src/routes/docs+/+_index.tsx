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
                <p>here are the docs</p>
            </main>
        </Layout>
    )
}
