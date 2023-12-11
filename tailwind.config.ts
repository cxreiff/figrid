import { type Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate"
import radixPlugin from "tailwindcss-radix"

export default {
    content: ["./src/**/*.{ts,tsx}"],
    plugins: [animatePlugin, radixPlugin],
    important: true,
} satisfies Config
