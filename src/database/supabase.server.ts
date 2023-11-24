import { createServerClient, parse, serialize } from "@supabase/ssr"
import { type SupabaseClient } from "@supabase/supabase-js"
import { redirect } from "@vercel/remix"

export function supabaseServer(request: Request) {
  const cookies = parse(request.headers.get("Cookie") ?? "")
  const headers = new Headers()

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return cookies[key]
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options))
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options))
        },
      },
    },
  )

  return [supabase, headers] as const
}

export async function requireUserSession(supabase: SupabaseClient) {
  const session = await supabase.auth.getSession()

  if (!session?.data?.session?.user?.id) {
    throw redirect("/auth")
  }

  return session.data.session
}
