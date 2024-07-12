import { createContext, useState } from "react"
import { Theme, useTheme } from "remix-themes"

type ContextThemeTransitionType = {
    theme: Theme | null
    themeTransitioning: boolean
    triggerThemeTransition: (theme: Theme) => void
}

export const ContextThemeTransition = createContext<ContextThemeTransitionType>(
    {
        theme: null,
        themeTransitioning: false,
        triggerThemeTransition: (_: Theme) => { },
    },
)

export function useThemeTransitionInitialContext(): ContextThemeTransitionType {
    const [themeTransitioning, setThemeTransitioning] = useState(false)
    const [theme, setTheme] = useTheme()

    const triggerThemeTransition = (theme: Theme) => {
        setTheme(theme)
        setThemeTransitioning(true)
        setTimeout(() => setThemeTransitioning(false), 150)
        setPWATheme(theme)
    }

    return { theme, themeTransitioning, triggerThemeTransition }
}

function setPWATheme(theme: Theme) {
    document.querySelector("meta[name='theme-color']")?.setAttribute("content", getThemeHSL(theme))
}

export function getThemeHSL(theme: Theme | null) {
    return theme == Theme.LIGHT ? "hsl(348 45% 64%)" : "hsl(240 10% 0%)"
}
