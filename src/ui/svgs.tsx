export function SVGs() {
    return (
        <svg className="invisible" width="0" height="0">
            <defs>
                <filter id="filter-radius">
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="4"
                        result="blur"
                    />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 100 -50"
                        result="mask"
                    />
                    <feComposite
                        in="SourceGraphic"
                        in2="mask"
                        operator="atop"
                    />
                </filter>
            </defs>
        </svg>
    )
}
