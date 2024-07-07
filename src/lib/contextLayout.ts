import { useFetcher } from "@remix-run/react"
import { createContext, type RefObject, useRef } from "react"
import type { ImperativePanelGroupHandle } from "react-resizable-panels"
import { z } from "zod"
import { useDebounce } from "~/lib/misc.ts"

const DEFAULT_LAYOUT_READ = [26, 48, 26] as const
const DEFAULT_LAYOUT_COMBO = [30, 70] as const
const DEFAULT_LAYOUT_VISUALS = [50, 50] as const
const DEFAULT_LAYOUT_AREA = [45, 55] as const
const DEFAULT_LAYOUT_STATUS = [45, 55] as const
const DEFAULT_LAYOUT_WRITE = [26, 48, 26] as const
const DEFAULT_LAYOUT_DETAILS = [30, 80] as const

const LAYOUT_MIN_SIZES = {
    read: [20, 25, 20] as const,
    combo: [30, 50] as const,
    visuals: [30, 30] as const,
    area: [20, 20] as const,
    status: [20, 20] as const,
    write: [20, 25, 20] as const,
    details: [30, 20] as const,
}

const percent = z.number().min(0).max(100)

export const layoutCookieSchema = z.object({
    read: z.tuple([percent, percent, percent]).optional().readonly(),
    combo: z.tuple([percent, percent]).optional().readonly(),
    visuals: z.tuple([percent, percent]).optional().readonly(),
    area: z.tuple([percent, percent]).optional().readonly(),
    status: z.tuple([percent, percent]).optional().readonly(),
    write: z.tuple([percent, percent, percent]).optional().readonly(),
    details: z.tuple([percent, percent]).optional().readonly(),
})

type LayoutCookieType = z.infer<typeof layoutCookieSchema>

type LayoutContextType = {
    readLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    comboLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    visualsLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    areaLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    statusLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    writeLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    detailsLayoutRef: RefObject<ImperativePanelGroupHandle> | null
    initialLayout: Required<LayoutCookieType>
    minSizes: Required<LayoutCookieType>
    saveLayout: () => void
    resetLayout: () => void
}

export const ContextLayout = createContext<LayoutContextType>({
    readLayoutRef: null,
    comboLayoutRef: null,
    visualsLayoutRef: null,
    areaLayoutRef: null,
    statusLayoutRef: null,
    writeLayoutRef: null,
    detailsLayoutRef: null,
    initialLayout: {
        read: DEFAULT_LAYOUT_READ,
        combo: DEFAULT_LAYOUT_COMBO,
        visuals: DEFAULT_LAYOUT_VISUALS,
        area: DEFAULT_LAYOUT_AREA,
        status: DEFAULT_LAYOUT_STATUS,
        write: DEFAULT_LAYOUT_WRITE,
        details: DEFAULT_LAYOUT_DETAILS,
    },
    minSizes: LAYOUT_MIN_SIZES,
    saveLayout: () => {},
    resetLayout: () => {},
})

export function useInitialLayoutContext(
    initialLayout: LayoutCookieType,
): LayoutContextType {
    const readLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const comboLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const visualsLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const areaLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const statusLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const writeLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const detailsLayoutRef = useRef<ImperativePanelGroupHandle>(null)
    const fetcher = useFetcher()

    const saveLayout = useDebounce(() => {
        fetcher.submit(
            {
                data: JSON.stringify({
                    read: readLayoutRef.current?.getLayout(),
                    combo: comboLayoutRef.current?.getLayout(),
                    visuals: visualsLayoutRef.current?.getLayout(),
                    area: areaLayoutRef.current?.getLayout(),
                    status: statusLayoutRef.current?.getLayout(),
                    write: writeLayoutRef.current?.getLayout(),
                    details: detailsLayoutRef.current?.getLayout(),
                }),
            },
            { action: "/actions/layout", method: "post" },
        )
    }, 100)

    const resetLayout = () => {
        readLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_READ])
        comboLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_COMBO])
        visualsLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_VISUALS])
        areaLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_AREA])
        statusLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_STATUS])
        writeLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_WRITE])
        detailsLayoutRef.current?.setLayout([...DEFAULT_LAYOUT_DETAILS])
        fetcher.submit(null, {
            action: "/actions/layout/delete",
            method: "post",
        })
    }

    return {
        readLayoutRef,
        comboLayoutRef,
        visualsLayoutRef,
        areaLayoutRef,
        statusLayoutRef,
        writeLayoutRef,
        detailsLayoutRef,
        initialLayout: {
            read: initialLayout.read || DEFAULT_LAYOUT_READ,
            combo: initialLayout.combo || DEFAULT_LAYOUT_COMBO,
            visuals: initialLayout.visuals || DEFAULT_LAYOUT_VISUALS,
            area: initialLayout.area || DEFAULT_LAYOUT_AREA,
            status: initialLayout.status || DEFAULT_LAYOUT_STATUS,
            write: initialLayout.write || DEFAULT_LAYOUT_WRITE,
            details: initialLayout.details || DEFAULT_LAYOUT_DETAILS,
        },
        minSizes: LAYOUT_MIN_SIZES,
        saveLayout,
        resetLayout,
    }
}
