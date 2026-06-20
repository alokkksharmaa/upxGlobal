import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiTargetLine,
  RiGroupLine,
  RiHandHeartLine,
  RiBarChartLine,
  RiArrowRightLine,
} from "react-icons/ri";

const VALUES = [
  {
    icon: RiTargetLine,
    title: "Mission-Driven",
    desc: "Democratizing quality education and making it accessible to every student across India.",
  },
  {
    icon: RiGroupLine,
    title: "Expert Faculty",
    desc: "Learn from industry professionals with years of hands-on experience at top companies.",
  },
  {
    icon: RiHandHeartLine,
    title: "Career Support",
    desc: "Dedicated placement guidance with 50+ hiring partners across India.",
  },
  {
    icon: RiBarChartLine,
    title: "Proven Results",
    desc: "95% placement rate with consistent student success across all programs.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-semibold text-xs uppercase tracking-widest">
              About Us
            </span>
            <h2 className="section-title mt-2 mb-5">
              Building India's Next Generation of Professionals
            </h2>
            <p className="text-primary-500 leading-relaxed mb-4">
              UPX Global Classes was founded with a singular vision — bridge the
              gap between academic education and what industry actually demands.
              Every program is designed with direct input from hiring managers
              and experienced professionals.
            </p>
            <p className="text-primary-500 leading-relaxed mb-8">
              Our practical, project-based curriculum ensures students don't
              just learn concepts — they develop real skills, build confidence,
              and step into their careers prepared.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { n: "5,000+", l: "Students Trained" },
                { n: "95%", l: "Placement Rate" },
                { n: "50+", l: "Hiring Partners" },
                { n: "4.9/5", l: "Student Rating" },
              ].map(({ n, l }) => (
                <div
                  key={l}
                  className="border border-primary-100 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-display font-bold text-primary-900">
                    {n}
                  </div>
                  <div className="text-primary-400 text-xs mt-1">{l}</div>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all"
            >
              Learn More About Us
              <RiArrowRightLine />
            </Link>
          </motion.div>

          {/* Values grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-primary-100 rounded-xl p-5 hover:border-accent/30 hover:shadow-card transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center mb-3">
                  <Icon className="text-accent text-lg" />
                </div>
                <h3 className="font-semibold text-primary-900 text-sm mb-1.5">
                  {title}
                </h3>
                <p className="text-primary-400 text-xs leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
