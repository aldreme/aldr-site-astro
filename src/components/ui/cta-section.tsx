"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Handshake, Layout, ShieldCheck, Sparkles, Zap, type LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Zap,
  Sparkles,
  Layout,
  Handshake,
  Globe,
};

interface CtaSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  iconName?: string;
  className?: string;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  iconName,
  className,
}) => {
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <section className={cn("relative overflow-hidden rounded-3xl", className)}>
      {/* Background with gradient and mesh pattern */}
      <div className="absolute inset-0 bg-blue-900">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/30 via-transparent to-indigo-900/50" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        {/* Animated accent glows */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 h-full w-full bg-blue-400/20 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {Icon && (
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-100 ring-1 ring-white/20">
                <Icon className="w-8 h-8" />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
            <p className="text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
          >
            <Button
              asChild
              size="lg"
              className="group bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 h-14 rounded-full text-lg shadow-xl shadow-blue-950/20"
            >
              <a href={buttonLink}>
                {buttonText}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
