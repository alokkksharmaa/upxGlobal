import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400 rounded-full blur-3xl" />
      </div>

      {/* Grid dots */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 bg-accent/20 text-accent border border-accent/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              🎓 India's Fastest-Growing EdTech
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight mb-6">
              Launch Your <span className="text-accent">Dream Career</span> with
              Expert Training
            </h1>
            <p className="text-primary-200 text-lg leading-relaxed mb-8 max-w-xl">
              Industry-aligned programs designed by experts. Learn real skills,
              build real projects, and land real jobs. Over 5,000+ students
              placed across top companies.
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { value: "5,000+", label: "Students Trained" },
                { value: "95%", label: "Placement Rate" },
                { value: "50+", label: "Hiring Partners" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-display font-bold text-accent">
                    {value}
                  </div>
                  <div className="text-primary-200 text-sm">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses" className="btn-accent text-base px-8 py-3.5">
                Explore Courses →
              </Link>
              <a
                href="#about"
                className="btn-secondary text-base px-8 py-3.5 border-white/40 text-white hover:bg-white/10"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Right — card stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Main card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-lifted">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <p className="text-white font-semibold">
                    Full Stack Development
                  </p>
                  <p className="text-primary-200 text-sm">6 months · ₹19,999</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  "React.js & Node.js",
                  "Firebase & MongoDB",
                  "REST APIs & JWT",
                  "Deployment & DevOps",
                ].map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 text-primary-100 text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs flex-shrink-0">
                      ✓
                    </span>
                    {skill}
                  </div>
                ))}
              </div>
              <Link
                to="/courses"
                className="mt-6 w-full btn-accent justify-center text-sm rounded-xl"
              >
                Enroll Now
              </Link>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg">
              ✓ Batch Starting Soon!
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2">
              <div className="flex -space-x-2">
                {["A", "B", "C"].map((l) => (
                  <div
                    key={l}
                    className="w-7 h-7 rounded-full bg-primary-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-gray-800">+240 enrolled</p>
                <p className="text-gray-500">this month</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <p className="text-primary-300 text-xs">Scroll to explore</p>
          <div className="w-0.5 h-8 bg-primary-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
