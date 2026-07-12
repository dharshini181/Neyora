import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Comparison from "@/components/landing/Comparison";
import HowItWorks from "@/components/landing/HowItWorks";
import Solutions from "@/components/landing/Solutions";
import Pricing from "@/components/landing/Pricing";
import { FAQSection, ContactSection } from "@/components/landing/FAQContact";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <Comparison />
      <HowItWorks />
      <Solutions />
      <Pricing />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
