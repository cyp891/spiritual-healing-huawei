import nodemailer from "nodemailer"
import { BookingConfirmationEmail } from "@/components/email-templates/booking-confirmation"

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
    const { name, email, phone, service, date, time } = await request.json()

    if (!name || !email || !service || !date || !time) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Booking submission:", { name, email, phone, service, date, time })

    const userEmailHtml = BookingConfirmationEmail({ name, service, date, time })
    const adminEmailHtml = BookingConfirmationEmail({
      name,
      service,
      date,
      time,
      isAdmin: true,
      clientEmail: email,
      phone,
    })

    await Promise.all([
      transporter.sendMail({
        from: FROM_EMAIL,
        to: email,
        subject: "Booking Confirmation - Serenity Wellness",
        html: userEmailHtml,
      }),
      transporter.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Booking: ${service} - ${date} at ${time}`,
        html: adminEmailHtml,
      }),
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
