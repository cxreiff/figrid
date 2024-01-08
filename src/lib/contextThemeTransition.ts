import { createContext, useState } from "react"
import { type Theme, useTheme } from "remix-themes"

type ContextThemeTransitionType = {
    theme: Theme | null
    themeTransitioning: boolean
    triggerThemeTransition: (theme: Theme) => void
}

export const ContextThemeTransition = createContext<ContextThemeTransitionType>(
    {
        theme: null,
        themeTransitioning: false,
        triggerThemeTransition: (_: Theme) => {},
    },
)

export const useThemeTransitionInitialContext =
    (): ContextThemeTransitionType => {
        const [themeTransitioning, setThemeTransitioning] = useState(false)
        const [theme, setTheme] = useTheme()

        const triggerThemeTransition = (theme: Theme) => {
            setTheme(theme)
            setThemeTransitioning(true)
            setTimeout(() => setThemeTransitioning(false), 150)
        }

        return { theme, themeTransitioning, triggerThemeTransition }
    }
