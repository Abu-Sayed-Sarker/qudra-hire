"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProfileCreationSuccess({
  onComplete,
  profileId,
}: {
  onComplete: () => void;
  profileId: string;
}) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 px-6">
        {/* Success circle with animated checkmark */}
        <motion.div
          className="relative h-28 w-28"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 0.8,
          }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#23C65F]/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Success ring */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#23C65F"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </svg>

          {/* Checkmark */}
          <motion.svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
          >
            <motion.path
              d="M30 52 L44 66 L70 38"
              fill="none"
              stroke="#23C65F"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
            />
          </motion.svg>
        </motion.div>

        {/* Confetti particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-[#23C65F]"
              initial={{
                x: "50%",
                y: "50%",
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 1.5,
                delay: 0.3 + i * 0.05,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Text content */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Profile Created!
          </h2>
          <p className="text-sm text-white/60 text-center max-w-xs">
            Your profile has been created successfully. Redirecting you to complete your profile...
          </p>
        </motion.div>

        {/* Countdown progress */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="h-1.5 w-48 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#23C65F]"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
            />
          </div>
          <p className="text-xs text-white/40 font-medium">
            Redirecting in {countdown}s
          </p>
        </motion.div>
      </div>
    </div>
  );
}
