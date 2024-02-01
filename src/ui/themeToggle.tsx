import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useContext } from "react"
import { Theme } from "remix-themes"

import { Button } from "~/ui/primitives/button.tsx"
import { ContextThemeTransition } from "~/lib/contextThemeTransition.ts"

export function ThemeToggle() {
    const { theme, triggerThemeTransition } = useContext(ContextThemeTransition)

    return (
        <Button
            size="icon"
            onClick={() =>
                triggerThemeTransition(
                    theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
                )
            }
        >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 !transition-transform dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 !transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">toggle theme</span>
        </Button>
    )
}
