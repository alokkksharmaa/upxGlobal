import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Do I need prior experience to join a course?",
    a: "No prior experience is required for most of our beginner courses. Each course page clearly mentions prerequisites. Our instructors are trained to bring beginners up to speed quickly.",
  },
  {
    q: "How does the enrollment process work?",
    a: 'Click "Enroll Now" on any course → Fill the enrollment form → Complete secure payment via Razorpay → Receive confirmation email instantly. The entire process takes under 5 minutes.',
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major payment methods including UPI, Credit/Debit Cards, Net Banking, and EMI options through our secure Razorpay payment gateway.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. We offer a 7-day money-back guarantee from the date of enrollment. If you are not satisfied for any reason, contact our support team and we will process your refund within 5-7 business days.",
  },
  {
    q: "Will I receive a certificate after completion?",
    a: "Absolutely! Upon successful course completion, you receive an industry-recognised digital certificate that you can add to your LinkedIn profile and resume.",
  },
  {
    q: "How is placement support provided?",
    a: "Our dedicated placement team helps with resume building, LinkedIn optimization, mock interviews, and connects you with our 50+ hiring partners. We've achieved a 95% placement rate.",
  },
  {
    q: "Are the sessions live or recorded?",
    a: "We offer live interactive sessions with expert instructors. All sessions are recorded and available for 1 year so you can revisit topics at your own pace.",
  },
  {
    q: "Can I switch courses after enrollment?",
    a: "Yes, you can switch to a different course within 7 days of enrollment (before the second class) by contacting our support team. Pricing differences will be adjusted accordingly.",
  },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="border border-gray-200 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-primary-50 transition-colors text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900 text-sm">{q}</span>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center transition-transform ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 pb-5 pt-0 bg-primary-50 text-gray-600 text-sm leading-relaxed border-t border-primary-100">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="section-title mt-2">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-4">
            Everything you need to know before you enroll.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <FAQItem key={i} {...item} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Still have questions?</p>
          <a href="#contact" className="btn-primary">
            Contact Our Support Team
          </a>
        </div>
      </div>
    </section>
  );
}
