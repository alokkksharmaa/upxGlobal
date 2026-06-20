import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      // In production, call POST /api/contact
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">
              Get In Touch
            </span>
            <h2 className="section-title mt-2 mb-6">We're Here to Help</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Have questions about a course, need guidance on which program to
              choose, or want to discuss corporate training? Our team is ready
              to assist you.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: "📧",
                  title: "Email Us",
                  val: "contact@upxglobal.info",
                  sub: "Response within 24 hours",
                  href: "mailto:contact@upxglobal.info",
                },
                {
                  icon: "📱",
                  title: "WhatsApp",
                  val: "+91 6291875728",
                  sub: "Mon–Sat, 9 AM – 6 PM IST",
                  href: "https://wa.me/916291875728",
                },
                {
                  icon: "🌐",
                  title: "Website",
                  val: "www.upxglobal.info",
                  sub: "Live training & resources",
                  href: "https://www.upxglobal.info",
                },
              ].map(({ icon, title, val, sub, href }) => (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 group-hover:bg-primary-200 transition-colors flex items-center justify-center text-xl flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {title}
                    </p>
                    <p className="text-primary-700 font-medium text-sm group-hover:text-primary-900 transition-colors">
                      {val}
                    </p>
                    <p className="text-gray-400 text-xs">{sub}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-card p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Priya Sharma"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="priya@example.com"
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject *
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Course enquiry, placement support..."
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  className="input-field resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5"
              >
                {loading ? "Sending…" : "Send Message →"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
