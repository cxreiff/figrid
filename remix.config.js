import path from "path"
import { glob } from "glob"
import { fileURLToPath } from "url"
import {
    ensureRootRouteExists,
    getRouteIds,
    getRouteManifest,
} from "remix-custom-routes"

/** @type {import('@remix-run/dev').AppConfig} */
export default {
    appDirectory: "src",
    serverPlatform: "neutral",
    cacheDirectory: "./node_modules/.cache/remix",
    watchPaths: ["./tailwind.config.ts"],
    serverDependenciesToBundle: ["tailwind-merge"],
    tailwind: true,
    postcss: true,
    ignoredRouteFiles: ["routes/**.*", "**/.*"],
    routes: async () => {
        /**
         * rather than have files in routes folder exposed by default, this config
         * will only pull in routes prefixed with a '+' character. routes that are
         * prefixed are then defined by their own filename, not directory structure.
         */
        const src = path.join(
            fileURLToPath(new URL(".", import.meta.url)),
            "src",
        )
        ensureRootRouteExists(src)
        const files = glob.sync("routes/**/+*.{js,jsx,ts,tsx}", { cwd: src })
        return getRouteManifest(
            getRouteIds(files, { prefix: "+", ignoredRouteFiles: ["**/.*"] }),
        )
    },
}
