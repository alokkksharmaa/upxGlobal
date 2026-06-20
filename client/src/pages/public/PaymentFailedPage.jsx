import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function PaymentFailedPage() {
  const { state } = useLocation();
  const { enrollmentId } = state || {};

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-red-50 to-white pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-lifted p-10 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">❌</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-500 mb-8">
            We couldn't process your payment. Don't worry — your enrollment
            details are saved and you can retry anytime.
          </p>

          <div className="bg-red-50 rounded-2xl p-5 mb-8 text-sm text-left space-y-2">
            <p className="text-gray-700">
              <strong>What might have happened:</strong>
            </p>
            <p className="text-gray-500">
              • Insufficient balance or card limit
            </p>
            <p className="text-gray-500">• Bank declined the transaction</p>
            <p className="text-gray-500">• Network error during payment</p>
            <p className="text-gray-500">• Payment session timed out</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {enrollmentId && (
              <Link
                to={`/enrollment/retry/${enrollmentId}`}
                className="btn-primary"
              >
                Retry Payment →
              </Link>
            )}
            <Link to="/courses" className="btn-secondary">
              Browse Courses
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Need help? Email us at{" "}
            <a href="mailto:support@upxglobal.com" className="text-primary-600">
              support@upxglobal.com
            </a>
          </p>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
