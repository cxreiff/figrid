import { createThemeAction } from "remix-themes"

import { themeSessionResolver } from "~/utilities/sessionTheme.server.ts"

export const action = createThemeAction(themeSessionResolver)
