import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function PaymentSuccessPage() {
  const { state } = useLocation();
  const { enrollmentId, transactionId, courseTitle, studentName } = state || {};

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-lifted p-10 text-center"
        >
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-5xl">✅</span>
          </motion.div>

          <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">
            Enrollment Confirmed! 🎉
          </h1>
          <p className="text-gray-500 mb-8">
            Welcome aboard, {studentName || "Student"}! Your enrollment in{" "}
            <strong>{courseTitle || "the course"}</strong> is confirmed.
          </p>

          {/* Details */}
          <div className="bg-green-50 rounded-2xl p-5 text-left space-y-3 mb-8">
            {[
              ["Enrollment ID", enrollmentId || "N/A"],
              ["Transaction ID", transactionId || "N/A"],
              ["Course", courseTitle || "N/A"],
              ["Status", "✓ PAID"],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-900">{val}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-8">
            📧 A confirmation email with joining instructions has been sent to
            your email address.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/courses" className="btn-primary">
              Browse More Courses
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
