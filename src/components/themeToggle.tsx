import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Theme, useTheme } from "remix-themes"

import { Button } from "~/components/ui/button.tsx"

export function ThemeToggle() {
    const [theme, setTheme] = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() =>
                setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
            }
        >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">toggle theme</span>
        </Button>
    )
}
