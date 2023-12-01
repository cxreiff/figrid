import type { TilesSelectModel } from "~/database/schema/grids.server.ts"

export function Map({ tile }: { tile: TilesSelectModel }) {
    return (
        <div className="faded-edge flex max-h-[100%] items-center justify-center overflow-hidden rounded-lg">
            <div className="grid h-full w-full grid-cols-5 gap-3">
                {Array(65)
                    .fill(1)
                    .map((x, y) => x + y)
                    .map((index) => (
                        <div
                            key={index}
                            className={
                                "h-24 border border-zinc-400" +
                                (index === 33 ? " bg-rose-400" : "")
                            }
                        />
                    ))}
            </div>
        </div>
    )
}
