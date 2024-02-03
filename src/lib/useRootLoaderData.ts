import { useRouteLoaderData } from "@remix-run/react"
import type { loader } from "~/root.tsx"

export function useRootLoaderData() {
    return useRouteLoaderData<typeof loader>("root")!
}
