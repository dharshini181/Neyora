"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mail, Send, ArrowRight } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

const faqs = [
  {
    q: "Is Neyora suitable for small tailoring shops?",
    a: "Yes. Neyora's Starter plan is built specifically for individual tailors and small shops, with room to grow into Business and Pro plans as you scale.",
  },
  {
    q: "Can I access my data from multiple devices?",
    a: "Yes, your workspace syncs in real time, so you can move between desktop, tablet, and mobile without losing anything.",
  },
  {
    q: "Is my business data secure?",
    a: "All customer, measurement, and order data is encrypted and stored securely with role-based access controls.",
  },
  {
    q: "Can I export customer records and measurements?",
    a: "Yes, you can export customer records, measurements, and invoices as PDF at any time.",
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">FAQ</p>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="glass overflow-hidden rounded-xl">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium"
              >
                {f.q}
                <Plus
                  size={16}
                  className={`shrink-0 text-primary transition-transform duration-300 ${
                    openIdx === i ? "rotate-45" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5"
                  >
                    <p className="pb-4 text-sm leading-relaxed text-secondary">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Big, standalone closing CTA — the last thing visitors see before the footer. */
export function ContactSection() {
  return (
    <section id="contact" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-deep relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16"
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

          <p className="relative mb-3 text-xs uppercase tracking-[0.25em] text-primary">
            Let&apos;s talk
          </p>
          <h2 className="relative mx-auto mb-5 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
            Let&apos;s Build Better Tailoring, Together
          </h2>
          <p className="relative mx-auto mb-10 max-w-xl text-base text-secondary">
            Have a question, a feature request, or just want to see a demo? We reply to every
            message personally.
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <GlowButton className="px-7 py-3.5 text-sm">
              <Mail size={16} /> Contact Us <ArrowRight size={15} />
            </GlowButton>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-xs items-center gap-2 rounded-full border border-primary/20 bg-black/30 p-1.5 sm:w-auto"
            >
              <input
                type="email"
                required
                placeholder="Or get product updates"
                className="w-full bg-transparent px-4 text-sm outline-none placeholder:text-secondary sm:w-56"
              />
              <button
                type="submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-black transition hover:brightness-110"
                aria-label="Subscribe"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
