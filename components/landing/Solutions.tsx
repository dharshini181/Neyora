"use client";

import { motion } from "framer-motion";
import { User, Shirt, Trophy, Building2, GraduationCap } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const solutions = [
  { icon: User, title: "Independent Tailors", desc: "Manage customers, measurements, and orders without paperwork." },
  { icon: Shirt, title: "Boutique Owners", desc: "Handle custom orders and repeat customers with ease." },
  { icon: Trophy, title: "Fashion Designers", desc: "Organize collections and client projects efficiently." },
  { icon: Building2, title: "Garment Workshops", desc: "Manage teams, multiple orders, inventory and production smoothly." },
  { icon: GraduationCap, title: "Tailoring Institutes", desc: "Support practical learning with structured workflows." },
];

export default function Solutions() {
  return (
    <section id="solutions" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">Built for every tailor</p>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Solutions for Every Tailoring Business
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard className="h-full text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <s.icon size={20} />
                </div>
                <h3 className="mb-2 text-sm font-medium">{s.title}</h3>
                <p className="text-xs leading-relaxed text-secondary">{s.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
