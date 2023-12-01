import type { TilesSelectModel } from "~/database/schema/grids.server.ts";

export function Map({ tile }: { tile: TilesSelectModel }) {
    return (
        <div className="flex justify-center items-center overflow-hidden max-h-[100%] rounded-lg faded-edge">
            <div className="w-full grid grid-cols-5 gap-3 h-full">
                {Array(65).fill(1).map((x, y) => x + y).map(index => (
                    <div key={index} className={"border border-zinc-400 h-24" + (index === 33 ? " bg-rose-400" : "")} />
                ))}
            </div>
        </div>
    )
}