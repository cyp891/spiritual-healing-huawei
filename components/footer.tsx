export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Spiritual Healing</h3>
            <p className="text-primary-foreground/80">
              Transforming lives through holistic spiritual healing and yoga practices.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a href="#services" className="hover:text-primary-foreground transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-primary-foreground transition">
                  Book Now
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary-foreground transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-primary-foreground/80">
              <a href="#" className="hover:text-primary-foreground transition">
                Instagram
              </a>
              <a href="#" className="hover:text-primary-foreground transition">
                Facebook
              </a>
              <a href="#" className="hover:text-primary-foreground transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2025 Spiritual Healing. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}
