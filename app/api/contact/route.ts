import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = body ?? {}

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 })
    }

    console.log("[v0] Contact form submission:", { name, email, message, at: new Date().toISOString() })

    // If you prefer Formspree, you could forward this server-side with fetch() to your endpoint.

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }
}
