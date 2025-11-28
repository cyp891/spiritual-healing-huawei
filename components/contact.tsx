"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle, Video } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const contactMethods = [
    {
      icon: <Phone size={32} />,
      title: "Phone",
      description: "Call us directly",
      value: "+49(555) 123-4567",
      action: "tel:+495551234567",
      buttonText: "Call Now",
    },
    {
      icon: <MessageCircle size={32} />,
      title: "WhatsApp",
      description: "Message us anytime",
      value: "+49(555) 123-4567",
      action: "https://wa.me/495551234567",
      buttonText: "Send Message",
    },
    {
      icon: <Mail size={32} />,
      title: "Email",
      description: "Send us an email",
      value: "33delena@gmail.com",
      action: "mailto:33delena@gmail.com",
      buttonText: "Email Us",
    },
    {
      icon: <Video size={32} />,
      title: "Zoom Session",
      description: "Virtual consultations",
      value: "Schedule online",
      action: "https://zoom.us",
      buttonText: "Schedule Zoom",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage("Message sent successfully! We'll get back to you soon.")
        setFormData({ name: "", email: "", message: "" })
        setTimeout(() => setSubmitMessage(""), 5000)
      } else {
        setSubmitMessage(data.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      setSubmitMessage("An error occurred. Please try again later.")
      console.error("Submit error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Get In Touch</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out through your preferred channel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, idx) => (
            <Card key={idx} className="border-border hover:border-primary/50 transition-all text-center">
              <CardHeader>
                <div className="flex justify-center text-primary mb-3">{method.icon}</div>
                <CardTitle className="text-primary">{method.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/60 mb-3">{method.description}</p>
                <p className="font-semibold text-foreground mb-4 break-all">{method.value}</p>
                <Button asChild className="w-full bg-primary hover:bg-accent text-primary-foreground">
                  <a href={method.action} target={method.action.startsWith("http") ? "_blank" : undefined}>
                    {method.buttonText}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-16 bg-primary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary">Contact Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your message..."
                  rows={4}
                  required
                ></textarea>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-accent text-primary-foreground disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
              {submitMessage && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    submitMessage.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
