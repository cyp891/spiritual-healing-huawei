import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = "hello@serenity-wellness.com"

export async function POST(request: Request) {
  try {
    const { name, email, phone, service, date, time } = await request.json()

    if (!name || !email || !service || !date || !time) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Booking submission:", { name, email, phone, service, date, time })

    // For now, just log the submission
    // In production, integrate with your email service and database

    // const userEmail = await resend.emails.send({
    //   from: "Serenity Wellness <noreply@serenity-wellness.com>",
    //   to: email,
    //   subject: "Booking Confirmation - Serenity Wellness",
    //   react: BookingConfirmationEmail({ name, service, date, time }),
    // })

    // const adminEmail = await resend.emails.send({
    //   from: "Serenity Wellness <noreply@serenity-wellness.com>",
    //   to: ADMIN_EMAIL,
    //   subject: `New Booking: ${service} - ${date} at ${time}`,
    //   react: BookingConfirmationEmail({ name, service, date, time, isAdmin: true, clientEmail: email, phone }),
    // })

    // if (userEmail.error || adminEmail.error) {
    //   return Response.json({ error: "Failed to send confirmation" }, { status: 500 })
    // }

    return Response.json({
      success: true,
      message: "Booking confirmed! We will send you a confirmation email shortly.",
    })
  } catch (error) {
    console.error("[v0] Booking error:", error)
    return Response.json({ error: "Failed to process your booking" }, { status: 500 })
  }
}
