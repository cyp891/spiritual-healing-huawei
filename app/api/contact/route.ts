import nodemailer from "nodemailer"
import { ContactEmailTemplate } from "@/components/email-templates/contact-email"
import { AdminNotificationEmail } from "@/components/email-templates/admin-notification"

const validateSMTPConfig = () => {
  const config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    secure: process.env.SMTP_SECURE,
    adminEmail: process.env.ADMIN_EMAIL,
    fromEmail: process.env.SMTP_FROM,
  }

  console.log("[v0] SMTP Config check:", {
    hasHost: !!config.host,
    hasPort: !!config.port,
    hasUser: !!config.user,
    hasPass: !!config.pass,
    hasSecure: !!config.secure,
    hasAdminEmail: !!config.adminEmail,
    hasFromEmail: !!config.fromEmail,
  })

  return config
}

const smtpConfig = validateSMTPConfig()

const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: Number.parseInt(smtpConfig.port || "587"),
  secure: smtpConfig.secure === "true",
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.pass,
  },
})

const ADMIN_EMAIL = smtpConfig.adminEmail || "admin@serenity-wellness.com"
const FROM_EMAIL = smtpConfig.fromEmail || "noreply@serenity-wellness.com"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Contact form submission:", { name, email, message })
    console.log("[v0] Sending to admin email:", ADMIN_EMAIL)

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
