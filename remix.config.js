import { flatRoutes } from "remix-flat-routes"

/** @type {import("@remix-run/dev").AppConfig} */
export default {
    appDirectory: "src",
    serverPlatform: "neutral",
    cacheDirectory: "./node_modules/.cache/remix",
    watchPaths: ["./tailwind.config.ts"],
    serverDependenciesToBundle: ["tailwind-merge"],
    tailwind: true,
    postcss: true,
    ignoredRouteFiles: ["**/*", "**/.*"],
    routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes, {
            appDir: "src",
            ignoredRouteFiles: [".*", "**/__*.*"],
        })
    },
}
