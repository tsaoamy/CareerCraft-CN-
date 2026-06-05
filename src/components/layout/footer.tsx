"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUp, Mail, MapPin, Phone,
  Github, Twitter, MailIcon, Heart
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useLocale } from "@/lib/i18n/locale-context";
import { OFFICIAL_EMAIL } from "@/lib/site-config";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: MailIcon, href: `mailto:${OFFICIAL_EMAIL}`, label: "Email" },
];

export function Footer() {
  const { t } = useLocale();
  const f = t.footer;
  const [showBackTop, setShowBackTop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const footerLinks = useMemo(() => ({
    [f.product]: [
      { label: t.navFull.dashboard, href: "/dashboard" },
      { label: t.navFull.matching, href: "/talent/matching" },
      { label: t.navFull.materials, href: "/materials" },
      { label: t.navFull.jdAnalyzer, href: "/jd-analyzer" },
      { label: t.navFull.resume, href: "/resume-builder" },
      { label: t.navFull.interview, href: "/interview" },
      { label: t.navFull.applications, href: "/applications" },
    ],
    [f.support]: [
      { label: f.help, href: "/help" },
      { label: f.privacy, href: "/privacy" },
      { label: f.terms, href: "/terms" },
      { label: f.contact, href: "/contact" },
    ],
    [f.about]: [
      { label: f.aboutUs, href: "/about" },
      { label: f.blog, href: "/blog" },
      { label: f.changelog, href: "/changelog" },
      { label: f.careers, href: "/careers" },
    ],
  }), [t, f]);

  useEffect(() => {
    const handleScroll = () => setShowBackTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => { setSubscribed(false); setNewsletterEmail(""); }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full apple-card flex items-center justify-center text-apple-text-secondary hover:text-[#0071e3] dark:hover:text-[#0a84ff] transition-all duration-200 hover:shadow-lg ${
          showBackTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label={t.common.backToTop}
      >
        <ArrowUp className="w-[18px] h-[18px]" />
      </button>

      <footer className="relative bg-canvas dark:bg-ink border-t border-hairline">
        <div className="h-[2px] bg-volt" />

        <div className="max-w-7xl mx-auto px-5">
          <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-5 group">
                <BrandLogo size="sm" showGlow />
                <span className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white group-hover:text-apple-blue transition-colors">
                  {t.brand}
                </span>
              </Link>
              <p className="text-[13px] text-apple-text-secondary leading-relaxed mb-6 max-w-[280px]">
                {t.brandTag}. {f.tagline}
              </p>

              <div className="space-y-2.5 mb-6">
                {[
                  { icon: Mail, text: OFFICIAL_EMAIL },
                  { icon: MapPin, text: f.address },
                  { icon: Phone, text: "+86 400-888-8888" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-[13px] text-apple-text-secondary">
                    <Icon className="w-[14px] h-[14px] shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center text-apple-text-secondary hover:text-[#0071e3] dark:hover:text-[#0a84ff] hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-all duration-200"
                    aria-label={label}
                  >
                    <Icon className="w-[17px] h-[17px]" />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-[12px] font-semibold text-apple-text-secondary uppercase tracking-widest mb-5">
                  {title}
                </h4>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1 text-[13px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors duration-200"
                      >
                        <span className="w-0 h-[2px] rounded-full bg-[#0071e3] group-hover:w-3 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="py-8 border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-[14px] font-semibold text-apple-text dark:text-white mb-1">
                  {f.newsletterTitle}
                </h4>
                <p className="text-[12px] text-apple-text-secondary">
                  {f.newsletterDesc}
                </p>
              </div>
              <form onSubmit={handleNewsletter} className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-[260px]">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-apple-text-secondary" />
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[13px] bg-[#e8e8ed] dark:bg-[#2c2c2e] border border-[#d2d2d7]/40 dark:border-[#38383a]/60 text-apple-text dark:text-white placeholder:text-apple-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]/50 transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className={`shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 ${
                    subscribed
                      ? "bg-[#34c759] text-white"
                      : "bg-gradient-to-r from-[#0071e3] to-[#5ac8fa] text-white hover:shadow-[0_4px_12px_rgba(0,113,227,0.3)]"
                  }`}
                >
                  {subscribed ? f.subscribed : f.subscribe}
                </button>
              </form>
            </div>
          </div>

          <div className="py-6 border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-apple-text-secondary flex items-center gap-1">
              &copy; 2026 {t.brand}. Made with
              <Heart className="w-3 h-3 text-[#ff375f] fill-[#ff375f] animate-bounce-in" />
              {f.copyright}
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-[12px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
              >
                {f.privacy}
              </Link>
              <Link
                href="/terms"
                className="text-[12px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
              >
                {f.terms}
              </Link>
              <span className="text-[12px] text-apple-text-secondary">{f.language}</span>
            </div>
          </div>
        </div>

        <div className="h-16 bg-gradient-to-t from-[#0071e3]/[0.03] to-transparent dark:from-[#0a84ff]/[0.02] pointer-events-none" />
      </footer>
    </>
  );
}
