import { Resend } from "resend"
import { ContactEmailTemplate } from "@/components/email-templates/contact-email"
import { AdminNotificationEmail } from "@/components/email-templates/admin-notification"

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = "cyp892@yahoo.com"
const FROM_EMAIL = "onboarding@resend.dev"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Contact form submission:", { name, email, message })

    const userEmailHtml = ContactEmailTemplate({ name, message })
    const userEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "We received your message - Serenity Wellness",
      html: userEmailHtml,
    })

    const adminEmailHtml = AdminNotificationEmail({ name, email, message })
    const adminEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Contact Form Message from ${name}`,
      html: adminEmailHtml,
    })

    if (userEmail.error || adminEmail.error) {
      console.error("[v0] Email sending error:", userEmail.error || adminEmail.error)
      return Response.json({ error: "Failed to send confirmation email" }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: "Thank you for your message. We will get back to you soon!",
    })
  } catch (error) {
    console.error("[v0] Contact error:", error)
    return Response.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
