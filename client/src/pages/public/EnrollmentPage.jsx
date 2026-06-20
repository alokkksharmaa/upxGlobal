import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import EnrollmentForm from "../../components/enrollment/EnrollmentForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from "../../services/api";

export default function EnrollmentPage({ isRetry = false }) {
  const { courseId, id: enrollmentId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadCourse = async () => {
      try {
        if (isRetry && enrollmentId) {
          const enRes = await api.get(`/enrollments/${enrollmentId}`);
          const cRes = await api.get(
            `/courses/${enRes.data.enrollment.courseId}`,
          );
          setCourse(cRes.data.course);
        } else {
          const res = await api.get(`/courses/${courseId}`);
          setCourse(res.data.course);
        }
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, enrollmentId, isRetry]);

  // Load Razorpay script
  useEffect(() => {
    if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (loading)
    return (
      <>
        <Navbar />
        <LoadingSpinner fullScreen />
      </>
    );

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-5xl">😕</p>
          <p className="text-gray-500">Course not found</p>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link
              to="/courses"
              className="text-primary-600 hover:text-primary-800 text-sm flex items-center gap-1"
            >
              ← Back to Courses
            </Link>
          </div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h1 className="font-display font-bold text-2xl text-primary-900 mb-2">
                  {isRetry ? "Retry Enrollment" : "Complete Enrollment"}
                </h1>
                <p className="text-gray-500 text-sm mb-8">
                  Fill in your details below. You'll be redirected to secure
                  payment after submission.
                </p>
                <EnrollmentForm course={course} />
              </div>
            </div>

            {/* Course Summary sidebar */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-3xl shadow-card p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="bg-primary-50 rounded-2xl p-4 mb-5">
                  <p className="font-semibold text-primary-900">
                    {course.title}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {course.duration} · {course.instructor}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Course Fee</span>
                    <span>₹{course.price?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span className="text-green-600">Included</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-700">
                      ₹{course.price?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  What's Included
                </h2>
                {[
                  "✅ Live interactive sessions",
                  "✅ Recorded video access (1 year)",
                  "✅ Industry certificate",
                  "✅ Placement support",
                  "✅ 7-day money-back guarantee",
                ].map((item) => (
                  <p
                    key={item}
                    className="text-sm text-gray-600 py-1.5 border-b border-gray-50 last:border-0"
                  >
                    {item}
                  </p>
                ))}
              </div>

              <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Secure Payment</span> powered
                  by Razorpay.
                  <br />
                  Your financial data is never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
