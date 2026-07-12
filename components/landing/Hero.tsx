"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import FloatingBackground from "./FloatingBackground";
import HeroIllustration from "./HeroIllustration";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" },
  }),
};

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-32">
      <FloatingBackground />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <motion.div
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-xs text-primary"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            The Modern Platform for Tailoring Businesses
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="font-display text-6xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
          >
            Tailoring
            <br />
            <span className="text-gradient">Reimagined.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-lg text-lg text-secondary"
          >
            Manage customers, measurements, production, and business operations
            in one connected workspace. Designed for tailors. Built for growth.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link href="/signup">
              <GlowButton>
                Get Started Free <ArrowRight size={16} />
              </GlowButton>
            </Link>
            <GlowButton variant="outline">
              <Play size={14} /> Watch Demo
            </GlowButton>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            custom={4}
            variants={fadeUp}
            className="mt-10 flex items-center gap-3 text-sm text-secondary"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-primary/10"
                />
              ))}
            </div>
            Built for tailors. Loved by professionals.
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          className="relative hidden items-center justify-center lg:flex"
        >
          <HeroIllustration />
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-primary/60"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
