"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LightboxProps {
  activeImage: string | null;
  onClose: () => void;
}

export default function Lightbox({ activeImage, onClose }: LightboxProps) {
  return (
    <AnimatePresence>
      {activeImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 sm:p-8 backdrop-blur-sm"
          onClick={onClose}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-50"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div
            className="w-full h-full overflow-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              className="max-w-full h-auto max-h-none rounded-[12px] shadow-2xl"
              alt="Fullscreen Ref"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
