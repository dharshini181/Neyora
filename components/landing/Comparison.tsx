"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const traditional = [
  "Paper measurement books",
  "Searching through old records",
  "Repeating measurements",
  "Manual pattern preparation",
  "Estimating fabric manually",
  "Phone calls for order updates",
  "Multiple notebooks & spreadsheets",
  "Limited business visibility",
];

const neyora = [
  "Digital customer profiles",
  "Instant search & retrieval",
  "Reuse measurements effortlessly",
  "Organized pattern management",
  "Smart material planning",
  "Real-time production tracking",
  "One connected workspace",
  "Clear dashboards & reports",
];

export default function Comparison() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">Ditch the old way</p>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Traditional Way vs The Neyora Way
          </h2>
        </div>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2" style={{ perspective: 1200 }}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ rotateY: 3, rotateX: -2, scale: 1.015 }}
            className="glass-deep rounded-2xl p-8"
          >
            <h3 className="mb-5 text-lg font-medium text-white/80">Traditional Way</h3>
            <ul className="space-y-3.5">
              {traditional.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-secondary">
                  <X size={16} className="mt-0.5 shrink-0 text-red-400/70" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ rotateY: -3, rotateX: -2, scale: 1.015 }}
            className="glass-deep rounded-2xl border-primary/40 p-8 shadow-glow"
          >
            <h3 className="mb-5 text-lg font-medium text-primary">The Neyora Way</h3>
            <ul className="space-y-3.5">
              {neyora.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="absolute left-1/2 top-1/2 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-background text-xs font-semibold text-primary shadow-glow md:flex">
            VS
          </div>
        </div>
      </div>
    </section>
  );
}
