import { Form } from "@remix-run/react"
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@vercel/remix"
import { authenticator } from "~/auth/authenticator.server"
import { FORM_PROVIDER } from "~/auth/providers/form.server"

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/protected",
  })
  return new Response("success", { status: 200 })
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate(FORM_PROVIDER, request, {
    successRedirect: "/protected",
    failureRedirect: "/auth/login",
  })
}

export default function Login() {
  return (
    <Form className="flex flex-col gap-2 p-4" method="post">
      <input
        className="bg-black"
        name="email"
        type="email"
        placeholder="email address"
      />
      <input
        className="bg-black"
        name="password"
        type="password"
        placeholder="password"
      />
      <button type="submit">log in</button>
    </Form>
  )
}
