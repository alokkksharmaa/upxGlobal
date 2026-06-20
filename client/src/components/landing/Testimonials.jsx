import React from "react";
import { motion } from "framer-motion";
import { RiStarFill, RiDoubleQuotesL } from "react-icons/ri";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    company: "Infosys",
    course: "Industry-Oriented Training",
    photo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&auto=format&fit=crop&q=80",
    rating: 5,
    text: "UpXGlobal completely transformed my career. The hands-on projects and mentor support helped me land my first job within 2 months of completing the course.",
  },
  {
    name: "Rahul Verma",
    role: "Data Analyst",
    company: "TCS",
    course: "Career Readiness Program",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&auto=format&fit=crop&q=80",
    rating: 5,
    text: "The course content is incredibly well-structured and industry-relevant. The placement support team worked tirelessly to help me get placed. I got my offer within 30 days.",
  },
  {
    name: "Ananya Singh",
    role: "Associate",
    company: "Wipro",
    course: "Professional Upskilling",
    photo:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&auto=format&fit=crop&q=80",
    rating: 5,
    text: "I was a working professional looking to switch roles. UpXGlobal's upskilling program gave me exactly the edge I needed — LinkedIn optimized, resume revamped, better role secured.",
  },
  {
    name: "Karthik Nair",
    role: "Business Analyst",
    company: "Accenture",
    course: "Industry-Oriented Training",
    photo:
      "https://images.unsplash.com/photo-1569124589354-615739ae007b?w=80&h=80&auto=format&fit=crop&q=80",
    rating: 5,
    text: "The real-world case studies and expert-led sessions set this apart from any other training I've done. The 45-day structure was intense but perfectly paced.",
  },
];

const Stars = ({ count }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <RiStarFill key={i} className="text-amber-400 text-sm" />
    ))}
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold text-xs uppercase tracking-widest">
            Student Stories
          </span>
          <h2 className="section-title mt-2">Results That Speak</h2>
          <p className="section-subtitle mt-4 mx-auto text-center">
            Hear directly from students who transformed their careers with UPX
            Global.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map(
            ({ name, role, company, course, photo, rating, text }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-primary-100 rounded-xl p-6 flex flex-col hover:border-accent/30 hover:shadow-card transition-all"
              >
                <RiDoubleQuotesL className="text-accent/30 text-3xl mb-3" />
                <Stars count={rating} />
                <p className="text-primary-500 text-sm leading-relaxed mt-3 mb-5 flex-1">
                  {text}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-primary-50">
                  <img
                    src={photo}
                    alt={name}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-primary-900 text-sm leading-none">
                      {name}
                    </p>
                    <p className="text-primary-400 text-xs mt-0.5">
                      {role} · {company}
                    </p>
                    <p className="text-accent text-xs mt-0.5">{course}</p>
                  </div>
                </div>
              </motion.div>
            ),
          )}
        </div>

        {/* Rating bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <div className="border border-primary-100 rounded-xl px-8 py-5 flex flex-wrap items-center justify-center gap-8 divide-x divide-primary-100">
            {[
              { value: "4.9", label: "Google Rating" },
              { value: "1,200+", label: "Reviews" },
              { value: "98%", label: "Would Recommend" },
            ].map(({ value, label }, i) => (
              <div key={label} className={`text-center ${i > 0 ? "pl-8" : ""}`}>
                <p className="text-2xl font-display font-bold text-primary-900">
                  {value}
                </p>
                <p className="text-primary-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
