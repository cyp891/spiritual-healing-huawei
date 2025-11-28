"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"

interface HeaderProps {
  onBookClick: () => void
}

export default function Header({ onBookClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-primary hidden sm:block">Spiritual Healing</h1>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
            <Globe size={16} className="text-accent" />
            <span className="text-sm text-foreground/70">We speak: German, English, Russian, Ukrainian, Greek</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-foreground hover:text-primary transition">
              Services
            </a>
            <a href="#booking" className="text-foreground hover:text-primary transition">
              Book Now
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              onClick={onBookClick}
              className="hidden sm:inline-flex bg-primary hover:bg-accent text-primary-foreground"
            >
              Book Session
            </Button>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <div className="px-3 py-2 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-accent" />
                <span className="text-xs font-medium text-accent">Languages Spoken</span>
              </div>
              <p className="text-sm text-foreground/70">German, English, Russian, Ukrainian, Greek</p>
            </div>
            <a href="#services" className="text-foreground hover:text-primary transition">
              Services
            </a>
            <a href="#booking" className="text-foreground hover:text-primary transition">
              Book Now
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition">
              Contact
            </a>
            <Button
              onClick={() => {
                onBookClick()
                setMobileMenuOpen(false)
              }}
              className="w-full bg-primary hover:bg-accent text-primary-foreground"
            >
              Book Session
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
