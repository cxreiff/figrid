import { createThemeAction } from "remix-themes"

import { themeSessionResolver } from "~/lib/sessionTheme.server.ts"

export const action = createThemeAction(themeSessionResolver)
