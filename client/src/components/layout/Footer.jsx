import React from "react";
import { Link, useLocation } from "react-router-dom";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "About Us", to: "/#about" },
  { label: "Contact", to: "/#contact" },
];

const COURSES = [
  "Full Stack Development",
  "Data Science & ML",
  "Cloud Computing",
  "Cyber Security",
  "UI/UX Design",
];

export default function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">UX</span>
              </div>
              <span className="font-display font-bold text-xl">UPX Global</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed mb-5">
              Empowering careers through industry-aligned training programs.
              Join thousands of students building their future with us.
            </p>
            <div className="flex gap-3">
              {["LinkedIn", "Twitter", "YouTube", "Instagram"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-9 h-9 rounded-lg bg-primary-800 hover:bg-accent transition-colors flex items-center justify-center text-xs font-bold"
                >
                  {s[0]}
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

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Our Courses
            </h4>
            <ul className="space-y-2">
              {COURSES.map((c) => (
                <li key={c}>
                  <Link
                    to="/courses"
                    className="text-primary-200 hover:text-accent text-sm transition-colors"
                  >
                    → {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-primary-200">
              <p>📧 support@upxglobal.com</p>
              <p>📞 +91-XXXXXXXXXX</p>
              <p>🕐 Mon–Fri, 9:00 AM – 6:00 PM IST</p>
              <p>📍 Bangalore, India</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-300">
          <p>
            © {new Date().getFullYear()} UPX Global EdTech. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
