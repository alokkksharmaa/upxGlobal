import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const REASONS = [
  {
    icon: "🎓",
    title: "Industry-Aligned Curriculum",
    desc: "Courses designed with direct input from CTOs and senior engineers at top companies.",
  },
  {
    icon: "💻",
    title: "Hands-On Project Learning",
    desc: "Build 5+ real-world projects per course, creating a portfolio that speaks to employers.",
  },
  {
    icon: "👨‍🏫",
    title: "Live Interactive Sessions",
    desc: "Real-time doubt clearing with instructors, not pre-recorded videos.",
  },
  {
    icon: "🤝",
    title: "Placement Guarantee",
    desc: "Dedicated placement support with guaranteed interview opportunities.",
  },
  {
    icon: "📱",
    title: "Learn Anywhere, Anytime",
    desc: "Access course materials, recordings, and projects from any device.",
  },
  {
    icon: "🏅",
    title: "Industry-Recognised Certificate",
    desc: "Certificates recognised by 50+ companies. Add to LinkedIn in one click.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Why UPX Global
          </span>
          <h2 className="section-title mt-2 mx-auto">The UPX Difference</h2>
          <p className="section-subtitle mt-4 mx-auto">
            We don't just teach — we transform. Here's why 5,000+ students chose
            UPX Global.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {REASONS.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-3xl p-7 hover:shadow-lifted hover:border-primary-200 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl mb-5 group-hover:bg-primary-200 transition-colors">
                {icon}
              </div>
              <h3 className="font-semibold text-primary-900 text-lg mb-2">
                {title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link to="/courses" className="btn-primary text-base px-10 py-4">
            View All Courses →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
