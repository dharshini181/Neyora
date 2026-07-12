"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    tagline: "For individuals getting started",
    price: "₹0",
    period: "/ Forever",
    features: [
      "Up to 100 Customers",
      "Up to 500 Measurements",
      "Up to 100 Orders",
      "Customer Management",
      "Basic Order Tracking",
      "Community Support",
    ],
    cta: "Get Started Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Business",
    tagline: "For growing tailoring businesses",
    price: "₹1,099",
    period: "/ month",
    features: [
      "Up to 10,000 Customers",
      "Up to 50,000 Measurements",
      "Unlimited Orders",
      "All Starter Features",
      "Pattern Studio",
      "Production Tracking",
      "Inventory Management",
      "Reports & Analytics",
      "Priority Support",
    ],
    cta: "Start Business Plan",
    href: "/signup",
    popular: true,
  },
  {
    name: "Pro",
    tagline: "For large workshops & enterprises",
    price: "₹4,999",
    period: "/ month",
    features: [
      "Unlimited Customers",
      "Unlimited Measurements",
      "Unlimited Orders",
      "Multi-Branch Management",
      "Team Roles & Permissions",
      "Advanced Reports",
      "Dedicated Account Manager",
      "Premium Support",
      "Custom Integrations",
    ],
    cta: "Contact Sales",
    href: "#contact",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">Simple pricing</p>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Plans That Grow With Your Business
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "glass relative flex flex-col rounded-2xl p-8",
                p.popular && "border-primary/60 shadow-glow-lg lg:-translate-y-3"
              )}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
                  Popular
                </span>
              )}
              <h3 className="mb-1 text-lg font-medium text-primary">{p.name}</h3>
              <p className="mb-6 text-sm text-secondary">{p.tagline}</p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{p.price}</span>
                <span className="text-sm text-secondary">{p.period}</span>
              </div>
              <ul className="mb-8 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                    <Check size={15} className="mt-0.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <GlowButton
                href={p.href}
                variant={p.popular ? "primary" : "outline"}
                className="w-full justify-center"
              >
                {p.cta}
              </GlowButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
