import { createThemeAction } from "remix-themes"

import { themeSessionResolver } from "~/utilities/themeSession.server.ts"

export const action = createThemeAction(themeSessionResolver)
