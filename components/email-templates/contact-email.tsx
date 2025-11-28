export function ContactEmailTemplate({ name, message }: { name: string; message: string }): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #8B7355;">Thank you for reaching out, ${name}!</h2>
      <p>We received your message and appreciate you contacting Serenity Wellness.</p>

      <div style="background-color: #F5E6D3; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin-top: 0;">
          <strong>Your Message:</strong>
        </p>
        <p style="white-space: pre-wrap; color: #555;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      </div>

      <p>
        Our team will review your message and get back to you soon. If your matter is urgent, feel free to call us
        directly at <strong>+1 (555) 123-4567</strong> or reach out via WhatsApp.
      </p>

      <hr style="border-color: #D4A574; margin: 30px 0;" />

      <div style="font-size: 14px; color: #666;">
        <p style="margin-bottom: 5px;">
          <strong>Serenity Wellness</strong>
        </p>
        <p style="margin-bottom: 5px;">Email: hello@serenity-wellness.com</p>
        <p style="margin-bottom: 5px;">Phone: +1 (555) 123-4567</p>
        <p>Bringing peace and healing to your life</p>
      </div>
    </div>
  `
}
