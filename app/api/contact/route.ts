import nodemailer from "nodemailer"
import { ContactEmailTemplate } from "@/components/email-templates/contact-email"
import { AdminNotificationEmail } from "@/components/email-templates/admin-notification"

const sendEmail = async (to: string, subject: string, html: string, from: string) => {
  try {
    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASSWORD
    const secure = process.env.SMTP_SECURE

    if (!host || !port || !user || !pass) {
      console.log("[v0] SMTP not configured, skipping email send")
      return { success: true, skipped: true }
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number.parseInt(port),
      secure: secure === "true",
      auth: { user, pass },
    })

    await transporter.sendMail({ from, to, subject, html })
    return { success: true, skipped: false }
  } catch (error) {
    console.error("[v0] Email send error:", error instanceof Error ? error.message : String(error))
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@serenity-wellness.com"
    const FROM_EMAIL = process.env.SMTP_FROM || "noreply@serenity-wellness.com"

    console.log("[v0] Contact form submission:", { name, email, message })
    console.log("[v0] Sending to admin email:", ADMIN_EMAIL)

    const userEmailHtml = ContactEmailTemplate({ name, message })
    const adminEmailHtml = AdminNotificationEmail({ name, email, message })

    await Promise.all([
      sendEmail(email, "We received your message - Serenity Wellness", userEmailHtml, FROM_EMAIL),
      sendEmail(ADMIN_EMAIL, `New Contact Form Message from ${name}`, adminEmailHtml, FROM_EMAIL),
    ])

    return Response.json({
      success: true,
      message: "Thank you for your message. We will get back to you soon!",
    })
  } catch (error) {
    console.error("[v0] Contact error:", error)
    return Response.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
