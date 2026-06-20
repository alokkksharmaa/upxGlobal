import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    step: "01",
    title: "Select Your Course",
    icon: "🔍",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100",
    desc: "Browse our available training programs and choose the course that best matches your career goals.",
  },
  {
    step: "02",
    title: "Fill in Your Details",
    icon: "📝",
    color: "bg-violet-50 border-violet-200 text-violet-700",
    iconBg: "bg-violet-100",
    desc: "Provide accurate information — Full Name, Email Address, Mobile Number, Educational Qualification, and City / Location.",
  },
  {
    step: "03",
    title: "Review Your Order",
    icon: "📋",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100",
    desc: "Carefully review your selected course, course fee, applicable discounts, training duration, and batch details.",
  },
  {
    step: "04",
    title: "Secure Payment",
    icon: "💳",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    iconBg: "bg-orange-100",
    desc: "Complete your payment using our secure gateway via UPI, Debit Card, Credit Card, Net Banking, or Wallets.",
  },
  {
    step: "05",
    title: "Order Confirmation",
    icon: "✅",
    color: "bg-sky-50 border-sky-200 text-sky-700",
    iconBg: "bg-sky-100",
    desc: "Receive payment confirmation, enrollment details, course access information, and batch joining instructions via Email and WhatsApp.",
  },
  {
    step: "06",
    title: "Join the Program",
    icon: "🎓",
    color: "bg-pink-50 border-pink-200 text-pink-700",
    iconBg: "bg-pink-100",
    desc: "Attend your scheduled live sessions and access all learning resources provided by UpXGlobal.",
  },
];

const PAYMENT_METHODS = [
  { label: "UPI", icon: "📲" },
  { label: "Debit Card", icon: "💳" },
  { label: "Credit Card", icon: "💳" },
  { label: "Net Banking", icon: "🏦" },
  { label: "Wallets", icon: "👛" },
];

const IMPORTANT_NOTES = [
  "Please provide a valid email address and mobile number.",
  "Course access details will be shared only after successful payment verification.",
  "Keep a copy of your payment receipt for future reference.",
  "Training schedules and batch timings will be communicated through official channels.",
];

export default function CheckoutProcess() {
  return (
    <section id="how-to-enroll" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Simple & Transparent
          </span>
          <h2 className="section-title mt-2">Checkout & Purchase Process</h2>
          <p className="section-subtitle mt-4 mx-auto max-w-2xl">
            Thank you for choosing UpXGlobal. Follow these simple steps to
            complete your enrollment successfully.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {STEPS.map(({ step, title, icon, color, iconBg, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className={`relative rounded-2xl border p-6 ${color} hover:shadow-md transition-shadow duration-300`}
            >
              {/* Step number */}
              <span className="absolute top-4 right-5 text-4xl font-display font-black opacity-10 leading-none">
                {step}
              </span>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-2xl mb-4 shadow-sm`}
              >
                {icon}
              </div>

              {/* Step indicator pill */}
              <span className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-1 block">
                Step {step}
              </span>
              <h3 className="font-semibold text-gray-900 text-base mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl border border-primary-100 p-8 mb-8"
        >
          <h3 className="text-center font-semibold text-gray-900 text-lg mb-6">
            Accepted Payment Methods
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {PAYMENT_METHODS.map(({ label, icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100 text-sm font-medium text-gray-700"
              >
                <span>{icon}</span>
                {label}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            🔒 All transactions are processed through secure payment partners.
          </p>
        </motion.div>

        {/* Two-column: Important Notes + Help */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-7"
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-semibold text-gray-900 text-lg">
                Important Notes
              </h3>
            </div>
            <ul className="space-y-3">
              {IMPORTANT_NOTES.map((note, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Help */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary-700 rounded-2xl p-7 text-white"
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">💬</span>
              <h3 className="font-semibold text-xl">Need Help?</h3>
            </div>
            <p className="text-primary-200 text-sm mb-6">
              For any payment or enrollment-related assistance, we're here for
              you.
            </p>
            <div className="space-y-4">
              <a
                href="mailto:contact@upxglobal.info"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-3 text-sm font-medium"
              >
                <span className="text-xl">📧</span>
                <span>contact@upxglobal.info</span>
              </a>
              <a
                href="https://wa.me/916291875728"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 transition-colors rounded-xl px-4 py-3 text-sm font-medium"
              >
                <span className="text-xl">📱</span>
                <span>WhatsApp: +91 6291875728</span>
              </a>
            </div>
            <p className="mt-6 text-primary-300 text-xs">
              🔐 Secure & Trusted Learning — committed to a smooth enrollment
              experience.
            </p>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-primary-700 font-semibold text-sm mt-12 italic"
        >
          UpXGlobal – Get Skilled. Get Hired. Grow with Confidence.
        </motion.p>
      </div>
    </section>
  );
}
