import { createContext, type RefObject, useRef } from "react"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"

export const DEFAULT_LAYOUT_MAIN = [30, 40, 30]
export const DEFAULT_LAYOUT_AREA = [50, 50]
export const DEFAULT_LAYOUT_STATUS = [50, 50]

type ContextLayoutType = {
    mainLayout: RefObject<ImperativePanelGroupHandle> | null
    areaLayout: RefObject<ImperativePanelGroupHandle> | null
    statusLayout: RefObject<ImperativePanelGroupHandle> | null
    resetLayout: () => void
}

export const ContextLayout = createContext<ContextLayoutType>({
    mainLayout: null,
    areaLayout: null,
    statusLayout: null,
    resetLayout: () => {},
})

export function useInitialLayoutContext(): ContextLayoutType {
    const mainLayout = useRef<ImperativePanelGroupHandle>(null)
    const areaLayout = useRef<ImperativePanelGroupHandle>(null)
    const statusLayout = useRef<ImperativePanelGroupHandle>(null)

    const resetLayout = () => {
        mainLayout.current?.setLayout(DEFAULT_LAYOUT_MAIN)
        areaLayout.current?.setLayout(DEFAULT_LAYOUT_AREA)
        statusLayout.current?.setLayout(DEFAULT_LAYOUT_STATUS)
    }

    return {
        mainLayout,
        areaLayout,
        statusLayout,
        resetLayout,
    }
}
