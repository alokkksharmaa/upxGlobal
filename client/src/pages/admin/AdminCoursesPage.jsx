import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  fetchAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../store/slices/adminSlice";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const DEFAULT_VALUES = {
  title: "",
  description: "",
  duration: "",
  price: "",
  instructor: "",
  skillsCovered: "",
  learningOutcomes: "",
  status: "active",
  level: "beginner",
  category: "",
};

export default function AdminCoursesPage() {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((s) => s.admin);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    dispatch(fetchAdminCourses({}));
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    reset(DEFAULT_VALUES);
    setModalOpen(true);
  };
  const openEdit = (course) => {
    setEditing(course);
    reset({
      ...course,
      skillsCovered: Array.isArray(course.skillsCovered)
        ? course.skillsCovered.join(", ")
        : "",
      learningOutcomes: Array.isArray(course.learningOutcomes)
        ? course.learningOutcomes.join(", ")
        : "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
      skillsCovered: data.skillsCovered
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      learningOutcomes: data.learningOutcomes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const result = editing
      ? await dispatch(updateCourse({ id: editing.id, data: payload }))
      : await dispatch(createCourse(payload));

    if (
      createCourse.fulfilled.match(result) ||
      updateCourse.fulfilled.match(result)
    ) {
      toast.success(editing ? "Course updated!" : "Course created!");
      setModalOpen(false);
      dispatch(fetchAdminCourses({}));
    } else {
      toast.error("Failed to save course");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    const result = await dispatch(deleteCourse(id));
    if (deleteCourse.fulfilled.match(result)) {
      toast.success("Course deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Courses
          </h1>
          <p className="text-gray-500 text-sm">
            {courses?.total || 0} total courses
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + Add Course
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    "Title",
                    "Instructor",
                    "Duration",
                    "Price",
                    "Level",
                    "Status",
                    "Enrolled",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses?.items?.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-48 truncate">
                      {c.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.instructor}</td>
                    <td className="px-4 py-3 text-gray-600">{c.duration}</td>
                    <td className="px-4 py-3 font-semibold text-primary-700">
                      ₹{c.price?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600">
                      {c.level}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${c.status === "active" ? "badge-green" : "badge-yellow"} capitalize`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.enrollmentCount || 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="text-xs text-primary-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Course" : "Add New Course"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Course Title *
              </label>
              <input
                {...register("title", { required: "Required" })}
                className="input-field"
                placeholder="Full Stack Development"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Instructor *
              </label>
              <input
                {...register("instructor", { required: "Required" })}
                className="input-field"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description *
            </label>
            <textarea
              {...register("description", { required: "Required" })}
              rows={3}
              className="input-field resize-none"
              placeholder="Course description..."
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duration *
              </label>
              <input
                {...register("duration", { required: "Required" })}
                className="input-field"
                placeholder="6 months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (₹) *
              </label>
              <input
                type="number"
                {...register("price", { required: "Required", min: 1 })}
                className="input-field"
                placeholder="19999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Level *
              </label>
              <select {...register("level")} className="input-field">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <input
                {...register("category")}
                className="input-field"
                placeholder="Web Development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select {...register("status")} className="input-field">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Skills Covered * (comma-separated)
            </label>
            <input
              {...register("skillsCovered", { required: "Required" })}
              className="input-field"
              placeholder="React, Node.js, MongoDB, Firebase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Learning Outcomes * (comma-separated)
            </label>
            <textarea
              {...register("learningOutcomes", { required: "Required" })}
              rows={2}
              className="input-field resize-none"
              placeholder="Build full-stack apps, Deploy to cloud, ..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editing ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
