/** @type {import('@remix-run/dev').AppConfig} */
export default {
    appDirectory: "src",
    serverPlatform: "neutral",
    cacheDirectory: "./node_modules/.cache/remix",
    ignoredRouteFiles: ["**/.*"],
    watchPaths: ["./tailwind.config.ts"],
    serverDependenciesToBundle: ["tailwind-merge"],
}
