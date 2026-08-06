"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0B2545]/30 via-black/98 to-black">
      <div className="flex flex-col items-center gap-10">
        {/* Premium ring animation */}
        <div className="relative h-32 w-32">
          {/* Outer rotating gradient ring */}
          <motion.svg
            className="absolute inset-0"
            viewBox="0 0 120 120"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#23C65F" />
                <stop offset="50%" stopColor="#23C65F" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#23C65F" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#ring-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="60 280"
            />
          </motion.svg>

          {/* Inner counter-rotating ring */}
          <motion.svg
            className="absolute inset-3"
            viewBox="0 0 100 100"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#23C65F"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="30 220"
              opacity="0.5"
            />
          </motion.svg>

          {/* Center logo with pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-[#23C65F]/20 blur-xl"
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <Image
                src="/logo.png"
                alt="CareerSprint"
                width={44}
                height={44}
                className="relative w-11 h-auto object-contain"
              />
            </motion.div>
          </div>
        </div>

        {/* Loading text with animated dots */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <p className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
            Loading
          </p>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#23C65F]"
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
