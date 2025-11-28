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
      console.log("[v0] SMTP not configured - email skipped")
      return { success: false, skipped: true }
    }

    const transporter = nodemailer.createTransport({
      host: String(host),
      port: Number(port),
      secure: secure === "true",
      auth: { user: String(user), pass: String(pass) },
    })

    const result = await transporter.sendMail({
      from: String(from),
      to: String(to),
      subject: String(subject),
      html: String(html),
    })

    return { success: true, skipped: false, messageId: result.messageId }
  } catch (error) {
    console.error("[v0] Email error:", error instanceof Error ? error.message : String(error))
    return { success: false, skipped: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "cyp892@yahoo.com"
    const FROM_EMAIL = process.env.SMTP_FROM || "noreply@stest.com"

    console.log("[v0] Contact form submission:", { name, email, message })

    const userEmailHtml = ContactEmailTemplate({ name, message })
    const adminEmailHtml = AdminNotificationEmail({ name, email, message })

    const [userEmailResult, adminEmailResult] = await Promise.allSettled([
      sendEmail(email, "We received your message - Serenity Wellness", userEmailHtml, FROM_EMAIL),
      sendEmail(ADMIN_EMAIL, `New Contact Form Message from ${name}`, adminEmailHtml, FROM_EMAIL),
    ]).then((results) =>
      results.map((r) => (r.status === "fulfilled" ? r.value : { success: false, error: "Email service failed" })),
    )

    return Response.json({
      success: true,
      message: "Thank you for your message. We will get back to you soon!",
      emailStatus: { userEmail: userEmailResult.success, adminEmail: adminEmailResult.success },
    })
  } catch (error) {
    console.error("[v0] Contact error:", error)
    return Response.json(
      {
        success: true,
        message: "Thank you for your message. We will contact you soon!",
        error: error instanceof Error ? error.message : "Email service unavailable",
      },
      { status: 200 },
    )
  }
}
