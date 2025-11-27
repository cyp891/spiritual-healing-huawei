export function AdminNotificationEmail({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
      <h2 style={{ color: "#8B7355" }}>New Contact Form Submission</h2>

      <div style={{ backgroundColor: "#F5E6D3", padding: "20px", borderRadius: "8px", margin: "20px 0" }}>
        <p>
          <strong>Client Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
        </p>
        <p style={{ marginTop: "15px" }}>
          <strong>Message:</strong>
        </p>
        <p
          style={{
            whiteSpace: "pre-wrap",
            color: "#555",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          {message}
        </p>
      </div>

      <p>
        <a
          href={`mailto:${email}`}
          style={{
            backgroundColor: "#8B7355",
            color: "white",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          Reply to {name}
        </a>
      </p>
    </div>
  )
}
