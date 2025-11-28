import nodemailer from "nodemailer"
import { BookingConfirmationEmail } from "@/components/email-templates/booking-confirmation"

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
    const { name, email, phone, service, date, time, notes } = await request.json()

    if (!name || !email || !service || !date || !time) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Booking submission:", { name, email, phone, service, date, time, notes })
    console.log("[v0] Sending to admin email:", ADMIN_EMAIL)

    const userEmailHtml = BookingConfirmationEmail({ name, service, date, time, notes })
    const adminEmailHtml = BookingConfirmationEmail({
      name,
      service,
      date,
      time,
      isAdmin: true,
      clientEmail: email,
      phone,
      notes,
    })

    const userEmailPromise = transporter
      .sendMail({
        from: FROM_EMAIL,
        to: email,
        subject: "Booking Confirmation - Serenity Wellness",
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
        subject: `New Booking: ${service} - ${date} at ${time}`,
        html: adminEmailHtml,
      })
      .catch((err) => {
        console.error("[v0] Failed to send admin email to", ADMIN_EMAIL, ":", err.message)
        throw err
      })

    await Promise.all([userEmailPromise, adminEmailPromise])

    return Response.json({
      success: true,
      message: "Booking confirmed! Check your email for confirmation details.",
    })
  } catch (error) {
    console.error("[v0] Booking error:", error)
    return Response.json({ error: "Failed to process your booking" }, { status: 500 })
  }
}
