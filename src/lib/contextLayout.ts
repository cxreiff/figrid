import { useFetcher } from "@remix-run/react"
import { createContext, type RefObject, useRef } from "react"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"
import { z } from "zod"
import { useDebounce } from "~/lib/misc.ts"

const DEFAULT_LAYOUT_READ = [26, 48, 26] as const
const DEFAULT_LAYOUT_AREA = [45, 55] as const
const DEFAULT_LAYOUT_STATUS = [45, 55] as const
const DEFAULT_LAYOUT_WRITE = [26, 48, 26] as const
const DEFAULT_LAYOUT_ASSETS = [50, 50] as const

const LAYOUT_MIN_SIZES = {
    read: [20, 25, 20] as const,
    area: [20, 20] as const,
    status: [20, 20] as const,
    write: [20, 25, 20] as const,
    assets: [30, 30] as const,
}

const percent = z.number().min(0).max(100)

export const layoutCookieSchema = z.object({
    read: z.tuple([percent, percent, percent]).optional().readonly(),
    area: z.tuple([percent, percent]).optional().readonly(),
    status: z.tuple([percent, percent]).optional().readonly(),
    write: z.tuple([percent, percent, percent]).optional().readonly(),
    assets: z.tuple([percent, percent]).optional().readonly(),
})

type LayoutCookieType = z.infer<typeof layoutCookieSchema>

type LayoutContextType = {
    readLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    areaLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    statusLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    writeLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    assetsLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    initialLayout: Required<LayoutCookieType>
    minSizes: Required<LayoutCookieType>
    saveLayout: () => void
    resetLayout: () => void
}

export const ContextLayout = createContext<LayoutContextType>({
    readLayoutRef: null,
    areaLayoutRef: null,
    statusLayoutRef: null,
    writeLayoutRef: null,
    assetsLayoutRef: null,
    initialLayout: {
        read: DEFAULT_LAYOUT_READ,
        area: DEFAULT_LAYOUT_AREA,
        status: DEFAULT_LAYOUT_STATUS,
        write: DEFAULT_LAYOUT_WRITE,
        assets: DEFAULT_LAYOUT_ASSETS,
    },
    minSizes: LAYOUT_MIN_SIZES,
    saveLayout: () => {},
    resetLayout: () => {},
})

export function useInitialLayoutContext(
    initialLayout: LayoutCookieType,
): LayoutContextType {
    const readLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const areaLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const statusLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const writeLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const detailsLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const assetsLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const fetcher = useFetcher()

    const saveLayout = useDebounce(() => {
        fetcher.submit(
            {
                data: JSON.stringify({
                    read: readLayoutRef.current?.getLayout(),
                    area: areaLayoutRef.current?.getLayout(),
                    status: statusLayoutRef.current?.getLayout(),
                    write: writeLayoutRef.current?.getLayout(),
                    details: detailsLayoutRef.current?.getLayout(),
                    assets: assetsLayoutRef.current?.getLayout(),
                }),
            },
            { action: "/actions/layout", method: "post" },
        )
    }, 100)

    const resetLayout = () => {
        readLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_READ])
        areaLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_AREA])
        statusLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_STATUS])
        writeLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_WRITE])
        assetsLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_ASSETS])
        fetcher.submit(null, {
            action: "/actions/layout/delete",
            method: "post",
        })
    }

    return {
        readLayoutRef,
        areaLayoutRef,
        statusLayoutRef,
        writeLayoutRef,
        assetsLayoutRef,
        initialLayout: {
            read: initialLayout.read || DEFAULT_LAYOUT_READ,
            area: initialLayout.area || DEFAULT_LAYOUT_AREA,
            status: initialLayout.status || DEFAULT_LAYOUT_STATUS,
            write: initialLayout.write || DEFAULT_LAYOUT_WRITE,
            assets: initialLayout.assets || DEFAULT_LAYOUT_ASSETS,
        },
        minSizes: LAYOUT_MIN_SIZES,
        saveLayout,
        resetLayout,
    }
}
