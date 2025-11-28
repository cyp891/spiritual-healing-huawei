"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServicesProps {
  onBookClick: () => void
}

const services = [
  {
    title: "Yoga",
    description: "From beginner to advanced, our yoga sessions improve flexibility, strength, and mental clarity.",
    icon: "🧘",
  },
  {
    title: "Meditation & Mindfulness",
    description: "Deep meditation practices to calm your mind, reduce stress, and enhance inner peace.",
    icon: "🕉️",
  },
  {
    title: "Energy Healing",
    description: "Reiki and energy work to balance your chakras and restore vital life force energy. Believing in that can take a leap of faith.",
    icon: "💫",
  },
  {
    title: "Metaphorical cards",
    description: "A versatile and effective tool for enhancing communication, promoting self-expression, and supporting the therapy.",
    icon: "🌬️",
  },
  {
    title: "Spiritual Counseling",
    description: "Personalized guidance for spiritual growth and life transformation. Rule of life provides structure and space for our growing.",
    icon: "🤝",
  },
  {
    title: "Wellness Retreats",
    description: "Immersive experiences combining yoga, meditation, and holistic wellness practices. Approach to mental & physical well-being",
    icon: "🌿",
  },
]

export default function Services({ onBookClick }: ServicesProps) {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Discover our comprehensive offerings designed to support your spiritual journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Card key={idx} className="border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-3">{service.icon}</div>
                <CardTitle className="text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 mb-6">{service.description}</p>
                <Button
                  onClick={onBookClick}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
