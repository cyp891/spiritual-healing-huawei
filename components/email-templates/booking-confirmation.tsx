export function BookingConfirmationEmail({
  name,
  service,
  date,
  time,
  isAdmin = false,
  clientEmail,
  phone,
  notes,
}: {
  name: string
  service: string
  date: string
  time: string
  isAdmin?: boolean
  clientEmail?: string
  phone?: string
  notes?: string
}): string {
  const details = `
    <p><strong>Client Name:</strong> ${name}</p>
    ${isAdmin ? `<p><strong>Email:</strong> ${clientEmail}</p>` : ""}
    ${isAdmin ? `<p><strong>Phone:</strong> ${phone || "Not provided"}</p>` : ""}
    <p><strong>Service:</strong> ${service}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    ${notes ? `<p><strong>Additional Notes:</strong></p><p style="white-space: pre-wrap; color: #555; background-color: #fff; padding: 10px; border-radius: 4px;">${notes.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>` : ""}
  `

  const mainContent = isAdmin
    ? "<p>A new booking has been made. Please review the details above and prepare for the session.</p>"
    : `
      <p>Thank you for booking with us! Your session is confirmed for:</p>
      <p style="font-size: 16px; font-weight: bold; color: #8B7355;">${service} on ${date} at ${time}</p>
      <p>Please arrive 5-10 minutes early. If you need to reschedule or have any questions, please reach out to us.</p>
    `

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #8B7355;">${isAdmin ? "New Booking Received" : "Booking Confirmation"}</h2>
      
      <div style="background-color: #F5E6D3; padding: 20px; border-radius: 8px; margin: 20px 0;">
        ${details}
      </div>
      
      ${mainContent}
      
      <hr style="border-color: #D4A574; margin: 30px 0;" />
      
      <div style="font-size: 14px; color: #666;">
        <p style="margin-bottom: 5px;"><strong>Spiritual Healing</strong></p>
        <p style="margin-bottom: 5px;">Email: hello@spiritualhealing.com</p>
        <p style="margin-bottom: 5px;">Phone: +49(555) 123-4567</p>
        <p>Bringing peace and healing to your life</p>
      </div>
    </div>
  `
}
