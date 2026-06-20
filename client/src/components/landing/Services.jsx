import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ─── Service Data ─────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 1,
    title: "Industry-Oriented Training",
    price: "₹800",
    duration: "45-day program",
    available: true,
    icon: "🎓",
    accent: "#3b82f6",
    tagColor: "bg-blue-100 text-blue-700",
    borderHover: "hover:border-blue-300",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
    features: [
      "Practical, job-focused learning",
      "Industry-relevant curriculum",
      "Hands-on assignments and projects",
      "Expert-led training sessions",
      "Real-world case studies",
    ],
  },
  {
    id: 2,
    title: "Technical Skill Development",
    price: null,
    duration: null,
    available: false,
    badge: "Coming Soon",
    icon: "💻",
    accent: "#8b5cf6",
    tagColor: "bg-violet-100 text-violet-700",
    borderHover: "hover:border-violet-200",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
    features: [
      "Programming and Coding Training",
      "Data Analytics Fundamentals",
      "AI and Automation Tools",
      "Software Development Concepts",
      "Emerging Technology Exposure",
    ],
  },
  {
    id: 3,
    title: "Career Readiness Programs",
    price: "₹499",
    duration: "30-day program",
    available: true,
    icon: "🚀",
    accent: "#10b981",
    tagColor: "bg-emerald-100 text-emerald-700",
    borderHover: "hover:border-emerald-300",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80",
    features: [
      "Resume / CV Building",
      "LinkedIn Profile Optimization",
      "Personal Branding Support",
      "Professional Communication Skills",
      "Career Planning Guidance",
    ],
  },
  {
    id: 4,
    title: "Placement Assistance",
    price: null,
    duration: null,
    available: false,
    badge: "Coming Soon",
    icon: "🤝",
    accent: "#f97316",
    tagColor: "bg-orange-100 text-orange-700",
    borderHover: "hover:border-orange-200",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop&q=80",
    features: [
      "Job Opportunity Referrals",
      "Mock Interview Sessions",
      "HR & Technical Interview Preparation",
      "Hiring Partner Network Access",
      "Placement Support and Guidance",
    ],
  },
  {
    id: 5,
    title: "Professional Upskilling",
    price: "₹800",
    duration: null,
    available: true,
    icon: "📈",
    accent: "#0ea5e9",
    tagColor: "bg-sky-100 text-sky-700",
    borderHover: "hover:border-sky-300",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80",
    features: [
      "Career Transition Support",
      "Skill Enhancement Programs",
      "Corporate Readiness Training",
      "Productivity and AI Tool Training",
      "Continuous Learning Opportunities",
    ],
  },
  {
    id: 6,
    title: "Management & Business Programs",
    price: null,
    duration: null,
    available: false,
    badge: "Coming Soon",
    icon: "💼",
    accent: "#ec4899",
    tagColor: "bg-pink-100 text-pink-700",
    borderHover: "hover:border-pink-200",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
    features: [
      "MBA Skill Development",
      "Leadership and Team Management",
      "Business Communication",
      "Corporate Etiquette Training",
      "Problem-Solving and Decision-Making",
    ],
  },
];

/* ─── Service Card ─────────────────────────────────────────────────────────── */
function ServiceCard({ service, index }) {
  const {
    title,
    price,
    duration,
    available,
    badge,
    icon,
    tagColor,
    borderHover,
    image,
    features,
  } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm ${borderHover} hover:shadow-lg transition-all duration-300 overflow-hidden`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Badge */}
        {!available && badge && (
          <span className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        {available && price && (
          <span className="absolute bottom-3 left-3 bg-white/95 text-gray-900 text-sm font-bold px-3 py-1 rounded-full shadow">
            {price}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title row */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl flex-shrink-0">{icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-snug">
              {title}
            </h3>
            {duration && (
              <span
                className={`mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${tagColor}`}
              >
                {duration}
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-1.5 flex-1 mb-5">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        {available ? (
          <Link
            to="/courses"
            className="w-full text-center text-sm font-semibold py-2.5 rounded-xl bg-primary-700 text-white hover:bg-primary-800 transition-colors"
          >
            Enroll Now
          </Link>
        ) : (
          <button
            disabled
            className="w-full text-center text-sm font-semibold py-2.5 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Coming Soon
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="section-title mt-2">Services We Provide</h2>
          <p className="section-subtitle mt-4 mx-auto max-w-2xl">
            From foundational training to career placement — our programs are
            designed to take you from learning to earning.
          </p>
        </motion.div>

        {/* 3 × 2 Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* College Collaboration — full-width card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-56 lg:h-auto overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80"
                alt="College and institutional collaboration"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-indigo-900/30" />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-indigo-700">
                🏛️ Institutional Program
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col justify-center">
              <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-2">
                Campus & Institutional Collaboration
              </span>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
                College & Institutional Collaboration
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                We directly collaborate with colleges for bulk enrolment. Our{" "}
                <strong>45 to 60-day program</strong> covers campus placement
                training, employability workshops, and hiring support — tailored
                for your institution.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Campus Placement Training",
                  "Employability Enhancement Workshops",
                  "Industry Readiness Programs",
                  "Guest Lectures and Seminars",
                  "Recruitment and Hiring Support",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-700 text-white font-semibold text-sm hover:bg-indigo-800 transition-colors w-fit"
              >
                Partner With Us →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
