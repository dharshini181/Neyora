"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scissors, Menu, X } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      {/* Permanent soft scrim so nav content stays readable regardless of what
          floats behind it, even before the glass background kicks in on scroll. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-background via-background/70 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <div
          className={`flex w-full items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${
            scrolled ? "glass shadow-glow-sm" : ""
          }`}
        >
          <a href="#home" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <Scissors size={16} />
            </span>
            NEYORA
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActive(link.href)}
                className={`relative text-sm transition-colors ${
                  active === link.href ? "text-primary" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {active === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,136,0.7)]"
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <GlowButton href="/signup" className="px-5 py-2 text-xs">
              Get Started
            </GlowButton>
          </div>

          <button
            className="text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-6 mt-2 flex flex-col gap-4 rounded-2xl p-6 lg:hidden"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                setActive(link.href);
                setOpen(false);
              }}
              className="text-sm text-white/80 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <GlowButton href="/signup" className="mt-2 w-full">
            Get Started
          </GlowButton>
        </motion.div>
      )}
    </motion.header>
  );
}
