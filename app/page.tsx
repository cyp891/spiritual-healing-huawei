"use client"

import { useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Services from "@/components/services"
import BookingSection from "@/components/booking-section"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onBookClick={() => setBookingOpen(true)} />
      <Hero onBookClick={() => setBookingOpen(true)} />
      <Services onBookClick={() => setBookingOpen(true)} />
      <BookingSection open={bookingOpen} onOpenChange={setBookingOpen} />
      <Contact />
      <Footer />
    </main>
  )
}
