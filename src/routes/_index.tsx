import { Link } from "@remix-run/react"
import { TextTyper } from "~/components/textTyper.tsx"

const loremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pharetra libero lectus, ut finibus velit molestie sit amet. Quisque in scelerisque ipsum. Maecenas lacinia pretium lectus sit amet consectetur. Integer viverra, leo ut luctus elementum, metus nunc dictum diam, a volutpat nulla tortor non orci. Maecenas a ultricies urna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam sollicitudin, nunc nec accumsan aliquet, lectus orci condimentum velit, non tempus eros neque at massa. Proin efficitur porta lectus, hendrerit varius eros convallis sed. Nulla lacinia vitae ex ullamcorper porta. In nec egestas orci. Sed tincidunt massa vitae fringilla tempor. Phasellus eu lorem non risus fermentum rutrum nec quis purus. Proin orci ligula, posuere quis nisi a, congue ultricies lectus. Nunc sit amet risus fringilla, pulvinar leo in, tristique sem. Fusce eget faucibus ipsum, ut mattis justo. Aliquam metus neque, faucibus nec mauris eu, tristique dictum elit.

Quisque interdum pulvinar sem nec vehicula. Integer at pellentesque justo, vitae elementum ex. Proin rutrum sem neque, ac vestibulum arcu tempor eu. Sed nec efficitur tellus. Nullam pharetra ultrices accumsan. Proin efficitur nisi ut faucibus lacinia. Morbi tempor non turpis non scelerisque. Morbi dictum libero massa, ac lacinia urna aliquet vitae. Suspendisse et congue purus. Integer ut nisl varius, venenatis urna id, bibendum libero.

Sed lorem justo, tristique sed ligula vitae, venenatis commodo arcu. Proin sodales interdum diam nec molestie. Sed vulputate, metus et tincidunt mollis, dolor ipsum maximus nibh, et rutrum turpis massa sit amet justo. Vivamus scelerisque venenatis ipsum vitae blandit. Sed eget bibendum tortor, sed hendrerit purus. Sed nec feugiat nibh. Nullam sit amet commodo mi, ultricies luctus orci. Maecenas eget nunc vel mauris porttitor ultrices. Vestibulum velit ex, aliquet vel posuere vitae, vestibulum non est. Nam commodo pellentesque quam, ac commodo eros tempus non. Nullam pulvinar ultricies imperdiet. Vivamus ligula risus, ullamcorper ac elit a, elementum vehicula augue. Nunc pharetra neque non facilisis dictum. Etiam metus neque, volutpat sed euismod sed, viverra et ante. Nam aliquam purus eu lacus porta imperdiet. Duis aliquet aliquet pharetra.

Duis vulputate purus sit amet risus gravida accumsan. Etiam feugiat condimentum turpis ac condimentum. In hendrerit vel dui eu iaculis. Mauris non sollicitudin massa, sed molestie eros. Cras pretium efficitur arcu ut euismod. Proin quis pretium ipsum. Morbi lobortis nulla risus, et convallis sem consequat id. Nulla facilisi. Proin vitae tempus orci, nec tempor ex. Proin posuere condimentum tellus, nec egestas magna pharetra at. Maecenas porta risus eleifend nibh ornare, et luctus felis ultricies.

Proin elementum sem sed odio condimentum, non volutpat metus pulvinar. Donec libero nunc, euismod quis ligula at, sagittis vehicula purus. Praesent maximus odio vel mi vulputate, a porta eros volutpat. Nam non dapibus dolor. Fusce non nulla faucibus, accumsan mi non, tincidunt leo. Nulla eu eleifend orci. Etiam congue in mauris vel fringilla. In ultricies felis nec hendrerit condimentum.
`.trim()

export default function Index() {
    return (
        <>
            <Link to="/read/1">first</Link>
            <TextTyper text={loremIpsum} className="p-6" />
        </>
    )
}
