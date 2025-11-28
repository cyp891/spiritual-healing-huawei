import nodemailer from "nodemailer"
import { BookingConfirmationEmail } from "@/components/email-templates/booking-confirmation"

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
    const { name, email, phone, service, date, time, notes } = await request.json()

    if (!name || !email || !service || !date || !time) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@serenity-wellness.com"
    const FROM_EMAIL = process.env.SMTP_FROM || "noreply@serenity-wellness.com"

    console.log("[v0] Booking submission:", { name, email, phone, service, date, time, notes })
    console.log("[v0] Sending to admin email:", ADMIN_EMAIL)

    const transporter = createTransporter()

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
