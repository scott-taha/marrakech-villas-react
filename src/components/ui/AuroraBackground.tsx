import type { ReactNode } from "react";
import { motion } from "framer-motion";

export const AuroraBackground = ({ children, className = "", videoSrc, videoPoster }: { children: ReactNode; className?: string, videoSrc?: string, videoPoster?: string }) => {
  return (
    <div className={`relative flex flex-col min-h-screen items-center justify-center text-white overflow-hidden ${className}`}>
      {videoSrc && (
        <video className="absolute inset-0 w-full h-full object-cover z-0" src={videoSrc} poster={videoPoster} autoPlay loop muted playsInline preload="auto" />
      )}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        <div className="pointer-events-none absolute -inset-[10px] opacity-[0.4] blur-[100px] sm:blur-[120px]">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear",
            }}
            className="absolute inset-0 z-0 bg-linear-to-r from-orange-500 via-amber-700 to-red-800 bg-size-[300%_300%] mix-blend-screen"
          />
          <motion.div
            animate={{
              backgroundPosition: ["100% 0%", "0% 100%", "100% 0%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
            className="absolute inset-0 z-0 bg-linear-to-l from-orange-400 via-yellow-600 to-black bg-size-[200%_200%] mix-blend-overlay opacity-60"
          />
        </div>
      </div>
      <div className="relative z-20 flex min-h-screen w-full flex-col">{children}</div>
    </div>
  );
};
