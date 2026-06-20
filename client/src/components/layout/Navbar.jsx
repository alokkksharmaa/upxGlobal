import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiMenuLine,
  RiCloseLine,
  RiArrowRightLine,
} from "react-icons/ri";
import logo from "../../assets/logo.png";

const NAV_LINKS = [
  { label: "Home",    to: "/" },
  { label: "About",   to: "/about" },
  { label: "Courses", to: "/courses" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location                  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return null;

  const isHome = location.pathname === "/";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-primary-100 shadow-sm"
          : isHome
          ? "bg-transparent"
          : "bg-white border-b border-primary-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logo} alt="UPX Global Classes" className="h-9 w-auto" />
            <div className="hidden sm:block">
              <p className={`font-display font-bold text-base leading-none ${
                scrolled || !isHome ? "text-primary-900" : "text-white"
              }`}>
                UPX Global
              </p>
              <p className={`text-xs leading-none mt-0.5 ${
                scrolled || !isHome ? "text-primary-500" : "text-white/70"
              }`}>
                Classes
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={label}
                  to={to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrolled || !isHome
                      ? active
                        ? "text-accent bg-accent/8"
                        : "text-primary-600 hover:text-primary-900 hover:bg-primary-50"
                      : active
                      ? "text-white bg-white/15"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/courses"
              className="btn-accent text-sm px-5 py-2.5 rounded-lg inline-flex items-center gap-2"
            >
              Enroll Now
              <RiArrowRightLine className="text-base" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled || !isHome
                ? "text-primary-700 hover:bg-primary-50"
                : "text-white hover:bg-white/10"
            }`}
          >
            {menuOpen
              ? <RiCloseLine className="text-xl" />
              : <RiMenuLine  className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-primary-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map(({ label, to }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={label}
                    to={to}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "text-accent bg-blue-50"
                        : "text-primary-700 hover:text-primary-900 hover:bg-primary-50"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-primary-100 mt-2">
                <Link
                  to="/courses"
                  className="btn-accent w-full justify-center mt-1"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="UPX Global Logo" className="h-10 w-auto" />
            <span
              className={`font-display font-bold text-xl hidden sm:inline ${scrolled ? "text-primary-900" : "text-white"}`}
            >
              UPX <span className="text-accent">Global</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <a
                key={label}
                href={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-primary-700 hover:bg-primary-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/courses"
              className="btn-primary text-sm px-5 py-2.5 rounded-lg"
            >
              Explore Courses
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? "text-gray-700" : "text-white"}`}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-current mb-1.5 transition-transform" />
            <span className="block w-6 h-0.5 bg-current mb-1.5" />
            <span className="block w-6 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(({ label, to }) => (
                <a
                  key={label}
                  href={to}
                  className="block px-4 py-2.5 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-primary-50 text-sm font-medium transition-colors"
                >
                  {label}
                </a>
              ))}
              <Link
                to="/courses"
                className="btn-primary w-full mt-2 justify-center"
              >
                Explore Courses
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
