"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BookingSectionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TimeSlot {
  time: string
  available: boolean
}

const services = [
  { id: 1, name: "Yoga Class", duration: "60 min", price: "$45" },
  { id: 2, name: "Meditation Session", duration: "45 min", price: "$35" },
  { id: 3, name: "Energy Healing", duration: "90 min", price: "$75" },
  { id: 4, name: "1:1 Spiritual Counseling", duration: "60 min", price: "$80" },
]

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 9; hour <= 18; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`
    slots.push({
      time,
      available: Math.random() > 0.3,
    })
    if (hour < 18) {
      const halfTime = `${hour.toString().padStart(2, "0")}:30`
      slots.push({
        time: halfTime,
        available: Math.random() > 0.3,
      })
    }
  }
  return slots
}

export default function BookingSection({ open, onOpenChange }: BookingSectionProps) {
  const [step, setStep] = useState<"service" | "date" | "time" | "details">("service")
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots())
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const getNextDates = () => {
    const dates = []
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i + 1)
      dates.push(date)
    }
    return dates
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const handleDateChange = (direction: "prev" | "next") => {
    if (!selectedDate) return
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(newDate)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedService && selectedDate && selectedTime && formData.name && formData.email) {
      setLoading(true)
      setSubmitMessage("")

      try {
        const serviceName = services.find((s) => s.id === selectedService)?.name
        const dateString = selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })

        const response = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: serviceName,
            date: dateString,
            time: selectedTime,
            notes: formData.notes,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setSubmitMessage("Booking confirmed! Check your email for details.")
          setTimeout(() => {
            setStep("service")
            setSelectedService(null)
            setSelectedDate(null)
            setSelectedTime(null)
            setFormData({ name: "", email: "", phone: "", notes: "" })
            setSubmitMessage("")
            onOpenChange(false)
          }, 2000)
        } else {
          setSubmitMessage(data.error || "Failed to confirm booking. Please try again.")
        }
      } catch (error) {
        setSubmitMessage("An error occurred. Please try again later.")
        console.error("Booking error:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Book a Session</DialogTitle>
        </DialogHeader>

        {step === "service" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Select a Service</h3>
            {services.map((service) => (
              <Card
                key={service.id}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedService === service.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => {
                  setSelectedService(service.id)
                  setStep("date")
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-primary">{service.name}</h4>
                    <p className="text-sm text-foreground/60">{service.duration}</p>
                  </div>
                  <span className="text-primary font-bold">{service.price}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === "date" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Select a Date</h3>
            <div className="grid grid-cols-2 gap-2">
              {getNextDates().map((date, idx) => (
                <Card
                  key={idx}
                  className={`p-3 text-center cursor-pointer transition-all border-2 ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setSelectedDate(date)
                    setStep("time")
                  }}
                >
                  <div className="text-sm font-semibold text-primary">{formatDate(date)}</div>
                </Card>
              ))}
            </div>
            <Button variant="outline" onClick={() => setStep("service")} className="w-full">
              Back
            </Button>
          </div>
        )}

        {step === "time" && selectedDate && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => handleDateChange("prev")} className="p-2 hover:bg-muted rounded">
                <ChevronLeft size={20} />
              </button>
              <h3 className="font-semibold text-lg text-primary">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              <button onClick={() => handleDateChange("next")} className="p-2 hover:bg-muted rounded">
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : slot.available ? "outline" : "secondary"}
                  disabled={!slot.available}
                  onClick={() => {
                    setSelectedTime(slot.time)
                    setStep("details")
                  }}
                  className={selectedTime === slot.time ? "bg-primary" : ""}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setStep("date")} className="w-full">
              Back
            </Button>
          </div>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Any special requests or health considerations..."
                rows={3}
              />
            </div>
            {submitMessage && (
              <div
                className={`p-3 rounded-md text-sm ${
                  submitMessage.includes("confirmed") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {submitMessage}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("time")}
                className="flex-1"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-accent text-primary-foreground disabled:opacity-50"
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
