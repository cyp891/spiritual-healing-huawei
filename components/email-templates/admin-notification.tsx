export function AdminNotificationEmail({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #8B7355;">New Contact Form Submission</h2>

      <div style="background-color: #F5E6D3; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>
          <strong>Client Name:</strong> ${name}
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:${email}">${email}</a>
        </p>
        <p style="margin-top: 15px;">
          <strong>Message:</strong>
        </p>
        <p style="white-space: pre-wrap; color: #555; background-color: #fff; padding: 10px; border-radius: 4px;">
          ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </p>
      </div>

      <p>
        <a
          href="mailto:${email}"
          style="background-color: #8B7355; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;"
        >
          Reply to ${name}
        </a>
      </p>
    </div>
  `
}
