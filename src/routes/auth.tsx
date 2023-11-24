import { useLoaderData } from "@remix-run/react"
import { Auth as AuthUi } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createBrowserClient } from "@supabase/ssr"
import { type LoaderFunctionArgs, json, redirect } from "@vercel/remix"
import { supabaseServer } from "~/database/supabase.server"
import { getEnv } from "~/utilities/env.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams
  const next = searchParams.get("next") || "/"

  const [supabase, headers] = supabaseServer(request)

  if ((await supabase.auth.getSession()).data.session?.user) {
    return redirect(next || "/protected", { headers })
  }

  const code = searchParams.get("code")
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return redirect(next || "/protected", { headers })
    }
  }

  return json({ env: getEnv() })
}

export default function Auth() {
  const { env } = useLoaderData<typeof loader>()

  if (!env) {
    throw Error("missing env variables")
  }

  return (
    <AuthUi
      supabaseClient={createBrowserClient(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY,
      )}
      redirectTo="http://localhost:3000/auth"
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
      providers={[]}
      dark
    />
  )
}
