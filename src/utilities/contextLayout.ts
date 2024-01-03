import { useFetcher } from "@remix-run/react"
import { createContext, type RefObject, useRef } from "react"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"
import { z } from "zod"
import { useDebounce } from "~/utilities/misc.ts"

export const DEFAULT_LAYOUT_MAIN = [30, 40, 30]
export const DEFAULT_LAYOUT_AREA = [50, 50]
export const DEFAULT_LAYOUT_STATUS = [50, 50]

export const layoutCookieSchema = z.object({
    main: z.array(z.number().min(0).max(100)).length(3).optional(),
    area: z.array(z.number().min(0).max(100)).length(2).optional(),
    status: z.array(z.number().min(0).max(100)).length(2).optional(),
})

type LayoutCookieType = z.infer<typeof layoutCookieSchema>

type LayoutContextType = {
    mainLayout: RefObject<ImperativePanelGroupHandle> | null
    areaLayout: RefObject<ImperativePanelGroupHandle> | null
    statusLayout: RefObject<ImperativePanelGroupHandle> | null
    initialLayout: Required<LayoutCookieType>
    saveLayout: () => void
    resetLayout: () => void
}

export const ContextLayout = createContext<LayoutContextType>({
    mainLayout: null,
    areaLayout: null,
    statusLayout: null,
    initialLayout: {
        main: DEFAULT_LAYOUT_MAIN,
        area: DEFAULT_LAYOUT_AREA,
        status: DEFAULT_LAYOUT_STATUS,
    },
    saveLayout: () => {},
    resetLayout: () => {},
})

export function useInitialLayoutContext(
    initialLayout: LayoutCookieType,
): LayoutContextType {
    const mainLayout = useRef<ImperativePanelGroupHandle>(null)
    const areaLayout = useRef<ImperativePanelGroupHandle>(null)
    const statusLayout = useRef<ImperativePanelGroupHandle>(null)
    const layoutFetcher = useFetcher()

    const saveLayout = useDebounce(() => {
        layoutFetcher.submit(
            {
                data: JSON.stringify({
                    main: mainLayout.current?.getLayout(),
                    area: areaLayout.current?.getLayout(),
                    status: statusLayout.current?.getLayout(),
                }),
            },
            { action: "/action/layout", method: "post" },
        )
    }, 100)

    const resetLayout = () => {
        mainLayout.current?.setLayout(DEFAULT_LAYOUT_MAIN)
        areaLayout.current?.setLayout(DEFAULT_LAYOUT_AREA)
        statusLayout.current?.setLayout(DEFAULT_LAYOUT_STATUS)
        layoutFetcher.submit(null, {
            action: "/action/layout/delete",
            method: "post",
        })
    }

    return {
        mainLayout,
        areaLayout,
        statusLayout,
        initialLayout: {
            main: initialLayout.main || DEFAULT_LAYOUT_MAIN,
            area: initialLayout.area || DEFAULT_LAYOUT_AREA,
            status: initialLayout.status || DEFAULT_LAYOUT_STATUS,
        },
        saveLayout,
        resetLayout,
    }
}
