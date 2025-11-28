import { Resend } from "resend"
import { BookingConfirmationEmail } from "@/components/email-templates/booking-confirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = "cyp892@otenet.gr"
const FROM_EMAIL = "onboarding@resend.dev"

export async function POST(request: Request) {
  try {
    const { name, email, phone, service, date, time } = await request.json()

    if (!name || !email || !service || !date || !time) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Booking submission:", { name, email, phone, service, date, time })

    const userEmailHtml = BookingConfirmationEmail({ name, service, date, time })
    const userEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Booking Confirmation - Serenity Wellness",
      html: userEmailHtml,
    })

    const adminEmailHtml = BookingConfirmationEmail({
      name,
      service,
      date,
      time,
      isAdmin: true,
      clientEmail: email,
      phone,
    })
    const adminEmail = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Booking: ${service} - ${date} at ${time}`,
      html: adminEmailHtml,
    })

    if (userEmail.error || adminEmail.error) {
      console.error("[v0] Email sending error:", userEmail.error || adminEmail.error)
      return Response.json({ error: "Failed to send confirmation email" }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: "Booking confirmed! Check your email for confirmation details.",
    })
  } catch (error) {
    console.error("[v0] Booking error:", error)
    return Response.json({ error: "Failed to process your booking" }, { status: 500 })
  }
}
