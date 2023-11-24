import { Form, useLoaderData } from "@remix-run/react"
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
} from "@vercel/remix"
import { requireUserSession, supabaseServer } from "~/database/supabase.server"

export const config = { runtime: "edge" }

export async function loader({ request }: LoaderFunctionArgs) {
  const [supabase] = supabaseServer(request)
  const { user } = await requireUserSession(supabase)
  return json({ user })
}

export async function action({ request }: ActionFunctionArgs) {
  const [supabase, headers] = supabaseServer(request)
  await supabase.auth.signOut()
  return redirect("/", { headers })
}

export default function Protected() {
  const { user } = useLoaderData<typeof loader>()
  return (
    <div className="p-4">
      <div>email: {user.email}</div>
      <Form method="post">
        <button type="submit">log out</button>
      </Form>
    </div>
  )
}
