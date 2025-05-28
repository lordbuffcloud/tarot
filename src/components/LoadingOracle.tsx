'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoadingOracle() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        <Image
          src="/images/ui-elements/app-icon.png"
          alt="Loading..."
          width={100}
          height={100}
          className="rounded-full shadow-2xl shadow-purple-500/50"
          priority
        />
      </motion.div>
      <motion.p 
        className="text-2xl font-semibold text-purple-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.7)]"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        The Oracle is consulting the astral plane...
      </motion.p>
    </div>
  );
} 