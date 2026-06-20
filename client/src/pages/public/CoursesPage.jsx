import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CourseCard from "../../components/courses/CourseCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { fetchCourses } from "../../store/slices/coursesSlice";

const LEVELS = ["All", "beginner", "intermediate", "advanced"];

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { items: courses, loading } = useSelector((s) => s.courses);
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
    window.scrollTo(0, 0);
  }, [dispatch]);

  const filtered = courses.filter((c) => {
    const matchLevel = level === "All" || c.level === level;
    const matchSearch =
      !search || c.title.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-20 text-white text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">
            All Programs
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Explore Our Courses
          </h1>
          <p className="text-primary-200 text-lg max-w-xl mx-auto">
            Find the perfect program to accelerate your career.
            Industry-aligned, hands-on, and placement-focused.
          </p>
        </div>

        {/* Filters */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center gap-4">
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field max-w-xs"
            />
            <div className="flex items-center gap-2 flex-wrap">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    level === l
                      ? "bg-primary-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm sm:ml-auto">
              {filtered.length} course{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {loading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-500">
                No courses match your search. Try different filters.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
