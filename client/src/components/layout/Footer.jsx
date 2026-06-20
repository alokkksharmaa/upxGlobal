import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "About Us", to: "/#about" },
  { label: "Services", to: "/#services" },
  { label: "How to Enroll", to: "/#how-to-enroll" },
  { label: "Contact Us", to: "/#contact" },
];

const PROGRAMS = [
  "Industry-Oriented Training",
  "Career Readiness Programs",
  "Professional Upskilling",
  "Technical Skill Development",
  "Management & Business Programs",
  "College Collaboration",
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", icon: "in", href: "#" },
  { label: "Twitter", icon: "𝕏", href: "#" },
  { label: "YouTube", icon: "▶", href: "#" },
  { label: "Instagram", icon: "◈", href: "#" },
];

export default function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="UpXGlobal" className="h-9 w-auto" />
            </div>
            <p className="text-primary-200 text-sm leading-relaxed mb-5">
              Empowering careers through industry-aligned training programs. Get
              Skilled. Get Hired. Grow with Confidence.
            </p>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-primary-800 hover:bg-accent transition-colors flex items-center justify-center text-xs font-bold"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <a
                    href={to}
                    className="text-primary-200 hover:text-accent text-sm transition-colors"
                  >
                    → {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Our Programs
            </h4>
            <ul className="space-y-2">
              {PROGRAMS.map((p) => (
                <li key={p}>
                  <a
                    href="/#services"
                    className="text-primary-200 hover:text-accent text-sm transition-colors"
                  >
                    → {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:contact@upxglobal.info"
                className="flex items-center gap-2 text-primary-200 hover:text-accent transition-colors"
              >
                <span>📧</span>
                <span>contact@upxglobal.info</span>
              </a>
              <a
                href="https://wa.me/916291875728"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-200 hover:text-green-400 transition-colors"
              >
                <span>📱</span>
                <span>+91 6291875728</span>
              </a>
              <p className="flex items-center gap-2 text-primary-300">
                <span>🕐</span>
                <span>Mon–Sat, 9:00 AM – 6:00 PM IST</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-primary-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-300">
            <div className="text-center sm:text-left">
              <p>
                Copyright © {new Date().getFullYear()} UpXGlobal — All Rights
                Reserved.
              </p>
              <p className="mt-1 text-primary-400">
                Powered by{" "}
                <span className="text-accent font-semibold">UpXGlobal</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {[
                { label: "About Us", href: "/#about" },
                { label: "Contact Us", href: "/#contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Refund & Cancellation", href: "/refund" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="hover:text-accent transition-colors whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
