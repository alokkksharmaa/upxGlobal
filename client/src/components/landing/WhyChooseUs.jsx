import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiBookOpenLine,
  RiCodeLine,
  RiLiveLine,
  RiMedalLine,
  RiDeviceLine,
  RiBadgeCheckLine,
} from "react-icons/ri";

const REASONS = [
  {
    icon: RiBookOpenLine,
    title: "Industry-Aligned Curriculum",
    desc: "Courses designed with direct input from hiring managers and senior professionals at top companies.",
  },
  {
    icon: RiCodeLine,
    title: "Hands-On Project Learning",
    desc: "Build real-world projects that create a strong portfolio demonstrating your skills to employers.",
  },
  {
    icon: RiLiveLine,
    title: "Live Interactive Sessions",
    desc: "Real-time doubt clearing with instructors — no pre-recorded videos collecting dust.",
  },
  {
    icon: RiMedalLine,
    title: "Placement Support",
    desc: "Dedicated placement guidance with interview preparation and hiring partner network access.",
  },
  {
    icon: RiDeviceLine,
    title: "Learn Anywhere, Anytime",
    desc: "Access course materials, recordings, and assignments from any device at your convenience.",
  },
  {
    icon: RiBadgeCheckLine,
    title: "Industry-Recognised Certificate",
    desc: "Certificates recognised by 50+ companies. Verifiable and LinkedIn-ready upon completion.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold text-xs uppercase tracking-widest">
            Why UPX Global
          </span>
          <h2 className="section-title mt-2 mx-auto">The UPX Difference</h2>
          <p className="section-subtitle mt-4 mx-auto text-center">
            We don't just teach — we transform. Here's why 5,000+ students chose
            UPX Global Classes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white border border-primary-100 rounded-xl p-6 hover:border-accent/30 hover:shadow-card transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-lg bg-accent/8 flex items-center justify-center mb-4">
                <Icon className="text-accent text-xl" />
              </div>
              <h3 className="font-semibold text-primary-900 text-base mb-2">
                {title}
              </h3>
              <p className="text-primary-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link to="/courses" className="btn-primary text-sm px-8 py-3">
            View All Courses
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
