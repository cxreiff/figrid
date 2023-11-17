import { Link } from "@remix-run/react";
import type { MetaFunction } from "@vercel/remix";
import { TextTyper } from "~/components/text-typer";
import { loremIpsum } from "~/utilities/lorem-ipsum";

export const config = { runtime: "edge" };

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="m-2 flex h-16 items-center gap-4 border border-stone-500 px-6 py-4">
        <Link to="/" className="grow">
          figrid
        </Link>
        <Link to="edge">/edge runtime</Link>
      </div>
      <main className="m-2 flex grow flex-col items-center justify-center border border-stone-500">
        <TextTyper text={loremIpsum} className="p-6" />
      </main>
    </div>
  );
}
