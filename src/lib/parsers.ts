import type { ZodObject, ZodRawShape } from "zod"
import { strictKeys } from "~/lib/misc.ts"

export function zodSearchParams<T extends ZodRawShape>(
    url: string,
    schema: ZodObject<T>,
) {
    const searchParams = new URL(url).searchParams
    const parseable = strictKeys(schema.shape).reduce<
        Partial<Record<keyof typeof schema.shape, number>>
    >(
        (prev, key) => ({
            ...prev,
            [key]: searchParams.get(key.toString()),
        }),
        {},
    )
    return schema.parse(parseable)
}
