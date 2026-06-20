import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/landing/Hero";
import About from "../../components/landing/About";
import WhyChooseUs from "../../components/landing/WhyChooseUs";
import Testimonials from "../../components/landing/Testimonials";
import FAQ from "../../components/landing/FAQ";
import ContactForm from "../../components/landing/ContactForm";
import CourseCard from "../../components/courses/CourseCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { fetchCourses } from "../../store/slices/coursesSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: courses, loading } = useSelector((s) => s.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />

        {/* Course Preview Section */}
        <section id="courses" className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">
                Our Programs
              </span>
              <h2 className="section-title mt-2">Training Programs</h2>
              <p className="section-subtitle mt-4 mx-auto">
                Industry-aligned courses designed to take you from beginner to
                job-ready.
              </p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {courses.slice(0, 6).map((course, i) => (
                  <CourseCard key={course.id} course={course} index={i} />
                ))}
              </div>
            )}

            {courses.length > 6 && (
              <div className="text-center mt-12">
                <a href="/courses" className="btn-secondary text-sm">
                  View All {courses.length} Courses →
                </a>
              </div>
            )}
          </div>
        </section>

        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
