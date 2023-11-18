import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import type { LinksFunction, MetaFunction } from "@vercel/remix";
import type { ReactNode } from "react";
import stylesheet from "~/styles.css";

export const meta: MetaFunction = () => {
  return [
    { title: "figrid.io" },
    { name: "description", content: "text adventure service" },
  ];
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="m-2 flex h-12 items-center gap-4 border border-stone-500 px-6 py-2">
        <Link to="/" className="grow">
          figrid
        </Link>
        <Link to="/room/1">first_room</Link>
      </div>
      <main className="m-2 flex grow flex-col items-center justify-center border border-stone-500">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={
          "min-h-screen bg-gradient-to-b from-stone-700 to-stone-900 font-sans text-white"
        }
      >
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
