import React from "react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Software Engineer @ Infosys",
    course: "Industry-Oriented Training",
    initials: "PS",
    photo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "UpXGlobal completely transformed my career. The hands-on projects and mentor support helped me land my dream job within 2 months of completing the course. Absolutely worth every rupee!",
    bg: "from-blue-500 to-primary-700",
  },
  {
    name: "Rahul Verma",
    role: "Data Analyst @ TCS",
    course: "Career Readiness Program",
    initials: "RV",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "The course content is incredibly well-structured and industry-relevant. The placement support team worked tirelessly to help me get placed. I got my offer within 30 days.",
    bg: "from-purple-500 to-primary-800",
  },
  {
    name: "Ananya Singh",
    role: "Associate @ Wipro",
    course: "Professional Upskilling",
    initials: "AS",
    photo:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "I was a working professional looking to switch roles. UpXGlobal's upskilling program gave me exactly the edge I needed. My LinkedIn was optimized, my resume was revamped — and I got a better role!",
    bg: "from-green-500 to-teal-700",
  },
  {
    name: "Karthik Nair",
    role: "Business Analyst @ Accenture",
    course: "Industry-Oriented Training",
    initials: "KN",
    photo:
      "https://images.unsplash.com/photo-1569124589354-615739ae007b?w=100&h=100&auto=format&fit=crop&q=80",
    rating: 5,
    text: "The real-world case studies and expert-led sessions set this apart from any other training I've done. The 45-day structure was intense but perfectly paced. Highly recommend!",
    bg: "from-orange-500 to-red-600",
  },
];

const Stars = ({ count }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-yellow-400 text-sm">
        ★
      </span>
    ))}
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="section-title mt-2">Success Stories</h2>
          <p className="section-subtitle mt-4 mx-auto">
            Don't take our word for it — hear directly from students who
            transformed their careers.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map(
            ({ name, role, course, initials, photo, rating, text, bg }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl shadow-card hover:shadow-lifted transition-shadow p-6 flex flex-col"
              >
                <Stars count={rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-6 flex-1">
                  "{text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img
                    src={photo}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-primary-100"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${bg} items-center justify-center text-white font-bold text-sm flex-shrink-0 hidden`}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {name}
                    </p>
                    <p className="text-gray-400 text-xs">{role}</p>
                    <p className="text-primary-600 text-xs">{course}</p>
                  </div>
                </div>
              </motion.div>
            ),
          )}
        </div>

        {/* Google rating badge */}
        <div className="flex justify-center mt-12">
          <div className="bg-white rounded-2xl shadow-card px-8 py-4 flex items-center gap-6 divide-x divide-gray-100">
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-primary-700">
                4.9
              </p>
              <Stars count={5} />
              <p className="text-gray-400 text-xs mt-1">Google Rating</p>
            </div>
            <div className="pl-6 text-center">
              <p className="text-3xl font-display font-bold text-primary-700">
                1,200+
              </p>
              <p className="text-gray-500 text-sm">Reviews</p>
            </div>
            <div className="pl-6 text-center">
              <p className="text-3xl font-display font-bold text-primary-700">
                98%
              </p>
              <p className="text-gray-500 text-sm">Would Recommend</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
