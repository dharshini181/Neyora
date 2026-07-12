"use client";

import { motion } from "framer-motion";
import { Users, Ruler, Shirt, Factory, Boxes } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const features = [
  {
    icon: Users,
    title: "Customer Workspace",
    desc: "Store all customer details, measurements, preferences, and order history in one secure place.",
  },
  {
    icon: Ruler,
    title: "Measurement Module",
    desc: "Capture, organize, and access accurate measurements anytime, anywhere.",
  },
  {
    icon: Shirt,
    title: "Pattern Studio",
    desc: "Create, customize, and reuse patterns with ease for consistent production.",
  },
  {
    icon: Factory,
    title: "Production Tracking",
    desc: "Track every stage of production from cutting to delivery in real-time.",
  },
  {
    icon: Boxes,
    title: "Inventory Management",
    desc: "Manage fabrics, trims, accessories, and stock levels effortlessly.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">Everything you need</p>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Powerful Tools. Seamlessly Connected.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard active={i === 2} className="h-full text-center sm:text-left">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary sm:mx-0">
                  <f.icon size={20} />
                </div>
                <h3 className="mb-2 font-medium">{f.title}</h3>
                <p className="text-sm leading-relaxed text-secondary">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
