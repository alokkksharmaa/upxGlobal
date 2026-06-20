import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiShieldCheckLine,
  RiArrowRightLine,
  RiCheckLine,
  RiUserStarLine,
  RiBriefcaseLine,
  RiGroupLine,
} from "react-icons/ri";

const STATS = [
  { icon: RiUserStarLine, value: "5,000+", label: "Students Trained" },
  { icon: RiBriefcaseLine, value: "95%", label: "Placement Rate" },
  { icon: RiGroupLine, value: "50+", label: "Hiring Partners" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-primary-900">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Glow accent */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ── Left — copy ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/25 text-accent text-sm font-medium mb-8">
              <RiShieldCheckLine className="text-base flex-shrink-0" />
              <span>Trusted by Students Across India</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.1] text-white font-bold mb-6">
              Build Skills That Create{" "}
              <span className="text-accent">Real Opportunities</span>
            </h1>

            <p className="text-primary-300 text-lg leading-relaxed mb-10 max-w-lg">
              Industry-focused training programs designed to help students gain
              practical skills, confidence, and career growth.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Link
                to="/courses"
                className="btn-accent text-base px-8 py-3.5 rounded-lg inline-flex items-center gap-2"
              >
                Explore Courses
                <RiArrowRightLine className="text-lg" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-white/20 text-white text-base font-semibold hover:bg-white/8 transition-colors"
              >
                Contact Us
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-accent text-xl" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-white text-xl leading-none">
                      {value}
                    </p>
                    <p className="text-primary-400 text-xs mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right — visual card ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.18 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main info card */}
              <div className="bg-white/7 backdrop-blur-sm border border-white/12 rounded-2xl p-8">
                <p className="text-primary-300 text-xs uppercase tracking-widest font-semibold mb-1">
                  Featured Program
                </p>
                <h3 className="text-white font-display font-bold text-xl mb-1">
                  Industry-Oriented Training
                </h3>
                <p className="text-primary-300 text-sm mb-6">
                  45-day program · ₹800
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Practical, job-focused learning",
                    "Industry-relevant curriculum",
                    "Hands-on projects & assignments",
                    "Expert-led training sessions",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-primary-200 text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                        <RiCheckLine className="text-accent text-xs" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/courses"
                  className="btn-accent w-full justify-center rounded-lg"
                >
                  Enroll Now — ₹800
                </Link>
              </div>

              {/* Floating badge — batch notice */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                <RiCheckLine className="text-sm" />
                New Batch Starting Soon
              </div>

              {/* Floating enrolled count */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-2.5 shadow-lifted flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["#3b82f6", "#10b981", "#f59e0b"].map((c, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: c }}
                    >
                      {["A", "B", "C"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-primary-900 text-sm leading-none">
                    240+ enrolled
                  </p>
                  <p className="text-primary-400 text-xs mt-0.5">this month</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
