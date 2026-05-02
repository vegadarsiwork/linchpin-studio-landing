import CTA from '@/components/sections/CTA'
import Clients from '@/components/sections/Clients'
import FAQs from '@/components/sections/FAQs'
import Hero from '@/components/sections/Hero'
import Pricing from '@/components/sections/Pricing'
import Services from '@/components/sections/Services'
import Testimonials from '@/components/sections/Testimonials'
import USPs from '@/components/sections/USPs'
import Work from '@/components/sections/Work'
import Footer from '@/components/ui/Footer'
import Navbar from '@/components/ui/Navbar'
import SmoothScroll from '@/components/ui/SmoothScroll'

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#260f26] text-white">
        <Navbar />
        <Hero />
        <Clients />
        <Services />
        <Work />
        <USPs />
        <Testimonials />
        <Pricing />
        <FAQs />
        <CTA />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
