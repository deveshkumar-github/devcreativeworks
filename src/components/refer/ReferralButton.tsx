import { Link } from "@tanstack/react-router";
import { Gift } from "lucide-react";

export function ReferralButton({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      to="/refer"
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[2px] ${className}`}
    >
      <span className="absolute inset-[-200%] animate-border-spin bg-[conic-gradient(from_0deg,transparent_0%,var(--brand)_25%,var(--orange)_50%,transparent_75%)]" />
      <span className="relative inline-flex items-center gap-2 rounded-full bg-background px-5 py-2 text-sm font-semibold text-navy transition-colors group-hover:bg-navy group-hover:text-white">
        <Gift className="w-4 h-4 text-orange" />
        Referral
      </span>
    </Link>
  );
}
