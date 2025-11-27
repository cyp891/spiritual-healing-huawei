"use client"

import { Button } from "@/components/ui/button"

interface HeroProps {
  onBookClick: () => void
}

export default function Hero({ onBookClick }: HeroProps) {
  return (
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent/10 via-background to-primary/5">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-6 text-balance leading-tight">
          Transform Your Mind, Body & Spirit
        </h2>
        <p className="text-lg sm:text-xl text-foreground/80 mb-12 max-w-2xl mx-auto text-balance leading-relaxed">
          Experience profound healing through expert-guided yoga, meditation, and spiritual wellness practices designed
          for your unique journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onBookClick}
            size="lg"
            className="bg-primary hover:bg-accent text-primary-foreground text-lg h-14"
          >
            Book Your Session
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary/10 text-lg h-14 bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
