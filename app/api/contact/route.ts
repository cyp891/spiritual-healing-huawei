import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = "hello@serenity-wellness.com"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Contact form submission:", { name, email, message })

    // For now, just log the submission
    // In production, integrate with your email service
    return Response.json({
      success: true,
      message: "Thank you for your message. We will get back to you soon!",
    })
  } catch (error) {
    console.error("[v0] Contact error:", error)
    return Response.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
