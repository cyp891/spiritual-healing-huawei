import nodemailer from "nodemailer"
import { BookingConfirmationEmail } from "@/components/email-templates/booking-confirmation"

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
    const { name, email, phone, service, date, time, notes } = await request.json()

    if (!name || !email || !service || !date || !time) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@serenity-wellness.com"
    const FROM_EMAIL = process.env.SMTP_FROM || "noreply@serenity-wellness.com"

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

    await Promise.all([
      sendEmail(email, "Booking Confirmation - Serenity Wellness", userEmailHtml, FROM_EMAIL),
      sendEmail(ADMIN_EMAIL, `New Booking: ${service} - ${date} at ${time}`, adminEmailHtml, FROM_EMAIL),
    ])

    return Response.json({
      success: true,
      message: "Booking confirmed! Check your email for confirmation details.",
    })
  } catch (error) {
    console.error("[v0] Booking error:", error)
    return Response.json({ error: "Failed to process your booking" }, { status: 500 })
  }
}
