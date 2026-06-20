import React from "react";
import { motion } from "framer-motion";

const VALUES = [
  {
    icon: "🎯",
    title: "Mission-Driven",
    desc: "Our mission is to democratize quality tech education and make it accessible to every student.",
  },
  {
    icon: "🏆",
    title: "Expert Faculty",
    desc: "Learn from industry veterans with 10+ years of hands-on experience at top companies.",
  },
  {
    icon: "🤝",
    title: "Career Support",
    desc: "Dedicated placement team with 50+ hiring partners across India and globally.",
  },
  {
    icon: "📊",
    title: "Proven Results",
    desc: "95% placement rate with an average salary of ₹6 LPA for our graduates.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">
              About Us
            </span>
            <h2 className="section-title mt-2 mb-6">
              Building India's Next Generation of Tech Professionals
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              UPX Global was founded with a singular vision: bridge the gap
              between academic education and industry requirements. We design
              every course with direct input from hiring managers and CXOs.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our immersive, project-based curriculum ensures you don't just
              learn concepts — you build production-grade applications that
              showcase your skills to employers.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "5,000+", l: "Students Trained" },
                { n: "95%", l: "Placement Rate" },
                { n: "50+", l: "Hiring Partners" },
                { n: "4.9/5", l: "Student Rating" },
              ].map(({ n, l }) => (
                <div
                  key={l}
                  className="bg-white rounded-2xl p-4 shadow-card text-center"
                >
                  <div className="text-2xl font-display font-bold text-primary-700">
                    {n}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Values grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {VALUES.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-card hover:shadow-lifted transition-shadow"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-primary-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
