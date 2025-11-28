import nodemailer from "nodemailer"
import { ContactEmailTemplate } from "@/components/email-templates/contact-email"
import { AdminNotificationEmail } from "@/components/email-templates/admin-notification"

const createTransporter = () => {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  const secure = process.env.SMTP_SECURE

  if (!host || !port || !user || !pass) {
    throw new Error("Missing SMTP configuration")
  }

  return nodemailer.createTransport({
    host,
    port: Number.parseInt(port),
    secure: secure === "true",
    auth: {
      user,
      pass,
    },
  })
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

    const transporter = createTransporter()

    const userEmailHtml = ContactEmailTemplate({ name, message })
    const adminEmailHtml = AdminNotificationEmail({ name, email, message })

    const userEmailPromise = transporter
      .sendMail({
        from: FROM_EMAIL,
        to: email,
        subject: "We received your message - Serenity Wellness",
        html: userEmailHtml,
      })
      .catch((err) => {
        console.error("[v0] Failed to send user email:", err.message)
        throw err
      })

    const adminEmailPromise = transporter
      .sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Contact Form Message from ${name}`,
        html: adminEmailHtml,
      })
      .catch((err) => {
        console.error("[v0] Failed to send admin email to", ADMIN_EMAIL, ":", err.message)
        throw err
      })

    await Promise.all([userEmailPromise, adminEmailPromise])

    return Response.json({
      success: true,
      message: "Thank you for your message. We will get back to you soon!",
    })
  } catch (error) {
    console.error("[v0] Contact error:", error)
    return Response.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
