"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, FileText, Bot, ArrowRight } from "lucide-react";

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
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Blurred overlay */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Modal Card */}
      <motion.div
        className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-slate-900/50 border border-white/10 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-3xl"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
      >
        {/* Glow behind the card */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center gap-8 z-10">

          {/* Animated AI Scanning Icon */}
          <div className="relative flex h-28 w-24 items-center justify-center bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-inner">
            {/* Base document icon */}
            <FileText className="h-12 w-12 text-white/30" strokeWidth={1.5} />

            {/* Scanning laser line */}
            <motion.div
              className="absolute top-0 h-0.5 w-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)] rounded-full z-10"
              animate={{ y: [0, 112, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Glow trail behind the laser */}
            <motion.div
              className="absolute top-0 h-12 w-full bg-linear-to-b from-transparent to-emerald-500/30 pointer-events-none"
              animate={{ y: [-48, 64, -48] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Animated scanning nodes */}
            <motion.div
              className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
              animate={{ backgroundPosition: ["0px 0px", "0px 100px"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* AI Bot icon floating nearby */}
          <motion.div
            className="absolute top-4 right-16 bg-emerald-500 rounded-full p-2.5 shadow-lg shadow-emerald-500/40 border border-emerald-400/50"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bot className="h-5 w-5 text-white" />
          </motion.div>

          {/* Floating Sparkles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-emerald-300 pointer-events-none"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (i - 1) * 30],
                y: [0, -20 - (i * 15)],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-3 w-3" />
            </motion.div>
          ))}

          {/* Text Content */}
          <motion.div
            className="flex flex-col items-center gap-3 text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="bg-linear-to-br from-white to-white/70 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent flex items-center justify-center gap-2 w-full">
              <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
              Analyzing CV...
            </h2>
            <p className="text-sm font-medium leading-relaxed text-white/60">
              Our AI is extracting information from your CV to build your profile. Redirecting you to see the results...
            </p>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            className="w-full flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full w-full rounded-full bg-linear-to-r from-emerald-500 to-blue-500"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
              />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Redirecting in {countdown}s
            </p>
          </motion.div>

          {/* Manual Continue Button */}
          {/* <motion.button
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-95 border border-white/5 hover:border-white/10"
            onClick={onComplete}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            View Results
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button> */}
        </div>
      </motion.div>
    </div>
  );
}
