import { TextTyper } from "~/components/text-typer"
import { loremIpsum } from "~/utilities/misc"

export const config = { runtime: "edge" }

export default function Index() {
  return <TextTyper text={loremIpsum} className="p-6" />
}
