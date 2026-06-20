import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from "../../services/api";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api
      .get(`/courses/${id}`)
      .then((res) => setCourse(res.data.course))
      .catch(() => setError("Course not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <>
        <Navbar />
        <LoadingSpinner fullScreen />
      </>
    );
  if (error || !course)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-5xl">😕</p>
          <p className="text-gray-500 text-lg">Course not found</p>
          <Link to="/courses" className="btn-primary">
            Browse All Courses
          </Link>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <span className="badge badge-blue mb-3 capitalize">
                {course.level}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-primary-200 text-lg leading-relaxed mb-6">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-5 text-sm text-primary-100">
                <span>⏱ {course.duration}</span>
                <span>👨‍🏫 {course.instructor}</span>
                <span>👥 {course.enrollmentCount || 0} enrolled</span>
                <span>📁 {course.category}</span>
              </div>
            </div>

            {/* Enroll card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-lifted self-start"
            >
              <p className="text-3xl font-display font-bold text-primary-700 mb-1">
                ₹{course.price?.toLocaleString("en-IN")}
              </p>
              <p className="text-gray-400 text-sm mb-5">
                One-time payment · No hidden charges
              </p>
              <Link
                to={`/enroll/${course.id}`}
                className="btn-primary w-full justify-center py-3.5"
              >
                Enroll Now →
              </Link>
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <p>✓ Lifetime access to recordings</p>
                <p>✓ Industry certificate on completion</p>
                <p>✓ Placement support included</p>
                <p>✓ 7-day money-back guarantee</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Course details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Learning Outcomes */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-primary-900 mb-5">
                What You'll Learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.learningOutcomes?.map((o) => (
                  <div
                    key={o}
                    className="flex items-start gap-2.5 bg-green-50 rounded-xl p-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-sm text-gray-700">{o}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills Covered */}
            <section>
              <h2 className="font-display text-2xl font-semibold text-primary-900 mb-5">
                Skills You'll Master
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {course.skillsCovered?.map((s) => (
                  <span
                    key={s}
                    className="bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Course Includes
              </h3>
              {[
                ["⏱", "Duration", course.duration],
                ["👨‍🏫", "Instructor", course.instructor],
                ["📊", "Level", course.level],
                ["🎯", "Category", course.category],
                ["📜", "Certificate", "Yes, on completion"],
              ].map(([icon, label, val]) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm"
                >
                  <span className="text-gray-500">
                    {icon} {label}
                  </span>
                  <span className="font-medium text-gray-900 capitalize">
                    {val}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to={`/enroll/${course.id}`}
              className="btn-accent w-full justify-center py-3.5"
            >
              Enroll for ₹{course.price?.toLocaleString("en-IN")} →
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
