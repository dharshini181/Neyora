"use client";

import { motion } from "framer-motion";
import { UserPlus, Ruler, Shirt, Boxes, Factory, CheckCircle2 } from "lucide-react";

const steps = [
  { n: "01", icon: UserPlus, title: "Create Customer", desc: "Add customer details and preferences." },
  { n: "02", icon: Ruler, title: "Measurements", desc: "Record & store accurate measurements." },
  { n: "03", icon: Shirt, title: "Pattern & Style", desc: "Choose style and prepare patterns." },
  { n: "04", icon: Boxes, title: "Plan Materials", desc: "Estimate fabrics & other materials." },
  { n: "05", icon: Factory, title: "Production", desc: "Manage production from start to finish." },
  { n: "06", icon: CheckCircle2, title: "Delivery", desc: "Deliver on time & build loyalty." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">Simple the process</p>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">How It Works</h2>
        </div>

        <div className="relative grid grid-cols-2 gap-y-14 sm:grid-cols-3 lg:grid-cols-6">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
            className="absolute top-8 hidden h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block"
          />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-background text-primary shadow-glow-sm"
              >
                <s.icon size={22} />
              </motion.div>
              <span className="mb-1 text-xs text-primary/70">{s.n}</span>
              <h3 className="mb-1 text-sm font-medium">{s.title}</h3>
              <p className="max-w-[140px] text-xs text-secondary">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
