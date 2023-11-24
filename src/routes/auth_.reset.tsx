import { useLoaderData } from "@remix-run/react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createBrowserClient } from "@supabase/ssr"
import { type LoaderFunctionArgs, json } from "@vercel/remix"
import { requireUserSession, supabaseServer } from "~/database/supabase.server"
import { getEnv } from "~/utilities/env.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const [supabase, headers] = supabaseServer(request)
  requireUserSession(supabase)
  return json({ env: getEnv() }, { headers })
}

export default function Reset() {
  const { env } = useLoaderData<typeof loader>()

  if (!env) {
    throw Error("missing env variables")
  }

  return (
    <Auth
      supabaseClient={createBrowserClient(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY,
      )}
      view="update_password"
      redirectTo="http:localhost:3000/protected"
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: "firebrick",
              brandAccent: "maroon",
              inputText: "white",
            },
          },
        },
      }}
      dark
    />
  )
}
