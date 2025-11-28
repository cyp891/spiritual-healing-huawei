import nodemailer from "nodemailer"
import { ContactEmailTemplate } from "@/components/email-templates/contact-email"
import { AdminNotificationEmail } from "@/components/email-templates/admin-notification"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@serenity-wellness.com"
const FROM_EMAIL = process.env.SMTP_FROM || "noreply@serenity-wellness.com"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Contact form submission:", { name, email, message })

    const userEmailHtml = ContactEmailTemplate({ name, message })
    const adminEmailHtml = AdminNotificationEmail({ name, email, message })

    await Promise.all([
      transporter.sendMail({
        from: FROM_EMAIL,
        to: email,
        subject: "We received your message - Serenity Wellness",
        html: userEmailHtml,
      }),
      transporter.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Contact Form Message from ${name}`,
        html: adminEmailHtml,
      }),
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
