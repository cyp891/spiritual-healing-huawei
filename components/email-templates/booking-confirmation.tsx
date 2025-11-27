export function BookingConfirmationEmail({
  name,
  service,
  date,
  time,
  isAdmin = false,
  clientEmail,
  phone,
}: {
  name: string
  service: string
  date: string
  time: string
  isAdmin?: boolean
  clientEmail?: string
  phone?: string
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
      <h2 style={{ color: "#8B7355" }}>{isAdmin ? "New Booking Received" : "Booking Confirmation"}</h2>

      <div style={{ backgroundColor: "#F5E6D3", padding: "20px", borderRadius: "8px", margin: "20px 0" }}>
        <p>
          <strong>Client Name:</strong> {name}
        </p>
        {isAdmin && (
          <p>
            <strong>Email:</strong> {clientEmail}
          </p>
        )}
        {isAdmin && (
          <p>
            <strong>Phone:</strong> {phone || "Not provided"}
          </p>
        )}
        <p>
          <strong>Service:</strong> {service}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Time:</strong> {time}
        </p>
      </div>

      {isAdmin ? (
        <p>A new booking has been made. Please review the details above and prepare for the session.</p>
      ) : (
        <>
          <p>Thank you for booking with us! Your session is confirmed for:</p>
          <p style={{ fontSize: "16px", fontWeight: "bold", color: "#8B7355" }}>
            {service} on {date} at {time}
          </p>
          <p>
            Please arrive 5-10 minutes early. If you need to reschedule or have any questions, please reach out to us.
          </p>
        </>
      )}

      <hr style={{ borderColor: "#D4A574", margin: "30px 0" }} />

      <div style={{ fontSize: "14px", color: "#666" }}>
        <p style={{ marginBottom: "5px" }}>
          <strong>Serenity Wellness</strong>
        </p>
        <p style={{ marginBottom: "5px" }}>Email: hello@serenity-wellness.com</p>
        <p style={{ marginBottom: "5px" }}>Phone: +1 (555) 123-4567</p>
        <p>Bringing peace and healing to your life</p>
      </div>
    </div>
  )
}
