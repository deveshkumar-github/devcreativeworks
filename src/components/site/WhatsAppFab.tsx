import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

const PHONE = "917013906671";

export function WhatsAppFab() {
  return (
    <motion.a
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent("Hi Dev Creative Works, I'd like to discuss a project.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 18 }}
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping" />
      <span className="relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full pl-4 pr-5 py-3.5 shadow-glow font-semibold">
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">Chat with us</span>
      </span>
    </motion.a>
  );
}