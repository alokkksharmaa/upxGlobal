import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LEVEL_COLORS = {
  beginner: "badge-green",
  intermediate: "badge-yellow",
  advanced: "badge-red",
};

export default function CourseCard({ course, index = 0 }) {
  const {
    id,
    title,
    description,
    duration,
    price,
    instructor,
    level,
    skillsCovered = [],
    enrollmentCount = 0,
    thumbnailUrl,
  } = course;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-3xl shadow-card hover:shadow-lifted transition-all duration-300 overflow-hidden flex flex-col group"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-primary-700 to-primary-900 overflow-hidden flex-shrink-0">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl opacity-30">🎓</div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`badge ${LEVEL_COLORS[level] || "badge-blue"} capitalize`}
          >
            {level}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
          ⏱ {duration}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-lg text-primary-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skillsCovered.slice(0, 3).map((s) => (
            <span
              key={s}
              className="bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {s}
            </span>
          ))}
          {skillsCovered.length > 3 && (
            <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full">
              +{skillsCovered.length - 3} more
            </span>
          )}
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-xs font-bold">
            {instructor?.[0] || "I"}
          </div>
          <span className="text-gray-500 text-xs">{instructor}</span>
          <span className="text-gray-300 mx-1">·</span>
          <span className="text-gray-400 text-xs">
            {enrollmentCount} enrolled
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-display font-bold text-primary-700">
              ₹{price?.toLocaleString("en-IN")}
            </p>
          </div>
          <Link
            to={`/enroll/${id}`}
            className="btn-primary text-sm px-5 py-2.5"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
