import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import logoAsset from "@/assets/dev-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <img src={logoAsset.url} alt="" className="h-10 w-10 object-contain bg-white rounded-lg p-1" />
            <span className="font-display font-bold text-xl">Dev <span className="text-orange">Creative Works</span></span>
          </div>
          <p className="text-white/70 max-w-md text-sm leading-relaxed">
            Building digital identities for businesses, temples, schools and entrepreneurs across India.
          </p>
          <p className="mt-6 font-display text-lg text-orange">You Progress. The Nation Follows.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="/#services" className="hover:text-orange">Services</a></li>
            <li><a href="/#work" className="hover:text-orange">Portfolio</a></li>
            <li><a href="/#about" className="hover:text-orange">About</a></li>
            <li><a href="/#contact" className="hover:text-orange">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Connect</h4>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/10 hover:bg-orange flex items-center justify-center transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/10 hover:bg-orange flex items-center justify-center transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="https://wa.me/917013906671" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/10 hover:bg-orange flex items-center justify-center transition-colors"><MessageCircle className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Dev Creative Works. All rights reserved.</p>
          <a href="/admin" className="hover:text-white/80">Admin</a>
        </div>
      </div>
    </footer>
  );
}