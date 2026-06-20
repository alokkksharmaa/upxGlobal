import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const DEGREES = [
  "B.Tech / B.E.",
  "BCA",
  "BCS",
  "Polytechnic",
  "B.Sc",
  "MCA",
  "M.Tech",
  "MBA",
  "Other",
];
const YEARS = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() + 2 - i,
);

export default function EnrollmentForm({ course }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResume] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries({ ...data, courseId: course.id }).forEach(([k, v]) =>
        formData.append(k, v),
      );
      if (resumeFile) formData.append("resume", resumeFile);

      const res = await api.post("/enrollments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const {
        razorpayOrderId,
        razorpayKeyId,
        amount,
        currency,
        enrollmentId,
        studentName,
        studentEmail,
        courseTitle,
      } = res.data;

      // Load Razorpay checkout
      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount,
        currency,
        name: "UPX Global",
        description: `Enrollment: ${courseTitle}`,
        order_id: razorpayOrderId,
        prefill: {
          name: studentName,
          email: studentEmail,
          contact: data.phone,
        },
        theme: { color: "#3f51b5" },
        handler: async (response) => {
          try {
            await api.post("/enrollments/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              enrollmentId,
            });
            navigate("/enrollment/success", {
              state: {
                enrollmentId,
                transactionId: response.razorpay_payment_id,
                courseTitle,
                studentName,
              },
            });
          } catch (err) {
            toast.error("Payment verification failed. Contact support.");
            navigate("/enrollment/failed", { state: { enrollmentId } });
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      });
      rzp.open();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Enrollment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    label,
    name,
    type = "text",
    placeholder,
    validation,
    children,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} *
      </label>
      {children || (
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, validation)}
          className={`input-field ${errors[name] ? "input-error" : ""}`}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {loading && <LoadingSpinner overlay />}

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Full Name"
          name="fullName"
          placeholder="Priya Sharma"
          validation={{
            required: "Full name is required",
            minLength: { value: 2, message: "Min 2 characters" },
          }}
        />
        <Field
          label="Email Address"
          name="email"
          type="email"
          placeholder="priya@example.com"
          validation={{
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
          }}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Phone Number"
          name="phone"
          placeholder="+91 9876543210"
          validation={{
            required: "Phone is required",
            pattern: {
              value: /^\+?[0-9]{7,15}$/,
              message: "Invalid phone number",
            },
          }}
        />
        <Field
          label="City"
          name="city"
          placeholder="Bangalore"
          validation={{ required: "City is required" }}
        />
      </div>

      <Field
        label="College / University Name"
        name="collegeName"
        placeholder="ABC Engineering College"
        validation={{ required: "College name is required" }}
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Degree"
          name="degree"
          validation={{ required: "Degree is required" }}
        >
          <select
            {...register("degree", { required: "Degree is required" })}
            className={`input-field ${errors.degree ? "input-error" : ""}`}
          >
            <option value="">Select your degree</option>
            {DEGREES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Graduation Year"
          name="graduationYear"
          validation={{ required: "Graduation year is required" }}
        >
          <select
            {...register("graduationYear", {
              required: "Required",
              valueAsNumber: true,
            })}
            className={`input-field ${errors.graduationYear ? "input-error" : ""}`}
          >
            <option value="">Select year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Resume{" "}
          <span className="text-gray-400 font-normal">
            (Optional — PDF or Word, max 5MB)
          </span>
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-primary-400 transition-colors text-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.size > 5 * 1024 * 1024) {
                toast.error("File size must be under 5 MB");
                e.target.value = "";
                return;
              }
              setResume(file || null);
            }}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <p className="text-sm text-gray-500">
              {resumeFile ? (
                <span className="text-primary-700 font-medium">
                  ✓ {resumeFile.name}
                </span>
              ) : (
                <>
                  📎{" "}
                  <span className="text-primary-600 font-medium hover:underline">
                    Click to upload
                  </span>{" "}
                  or drag & drop
                </>
              )}
            </p>
          </label>
        </div>
      </div>

      {/* Course summary */}
      <div className="bg-primary-50 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-primary-900">{course.title}</p>
          <p className="text-gray-500 text-sm">
            {course.duration} · {course.instructor}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-display font-bold text-primary-700">
            ₹{course.price?.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4 text-base"
      >
        {loading
          ? "Processing..."
          : `Pay ₹${course.price?.toLocaleString("en-IN")} & Enroll →`}
      </button>

      <p className="text-center text-xs text-gray-400">
        🔒 Secured by Razorpay · Your data is safe & encrypted
      </p>
    </form>
  );
}
