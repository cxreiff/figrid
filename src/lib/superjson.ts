import {
    useActionData,
    useLoaderData,
    useRouteLoaderData,
} from "@remix-run/react"
import * as _superjson from "superjson"

export type SuperJsonFunction = <Data>(
    data: Data,
    init?: number | ResponseInit,
) => SuperTypedResponse<Data>

export declare type SuperTypedResponse<T> = Response & {
    superjson(): Promise<T>
}

type AppData = any
type DataFunction = (...args: any[]) => unknown
type DataOrFunction = AppData | DataFunction

export type UseDataFunctionReturn<T extends DataOrFunction> = T extends (
    ...args: any[]
) => infer Output
    ? Awaited<Output> extends SuperTypedResponse<infer U>
        ? U
        : Awaited<ReturnType<T>>
    : Awaited<T>

export const superjson: SuperJsonFunction = (data, init = {}) => {
    let responseInit = typeof init === "number" ? { status: init } : init
    let headers = new Headers(responseInit.headers)
    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8")
    }
    return new Response(_superjson.stringify(data), {
        ...responseInit,
        headers,
    }) as SuperTypedResponse<typeof data>
}

export function useSuperLoaderData<T = AppData>(): UseDataFunctionReturn<T> {
    const data = useLoaderData()
    return _superjson.deserialize(data as _superjson.SuperJSONResult)
}
export function useSuperActionData<
    T = AppData,
>(): UseDataFunctionReturn<T> | null {
    const data = useActionData()
    return data
        ? _superjson.deserialize(data as _superjson.SuperJSONResult)
        : null
}

export function useSuperRouteLoaderData<T = AppData>(
    route: string,
): UseDataFunctionReturn<T> | null {
    const match = useRouteLoaderData(route)
    return match
        ? _superjson.deserialize(match as _superjson.SuperJSONResult)
        : null
}
