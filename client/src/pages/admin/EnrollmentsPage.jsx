import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments } from "../../store/slices/adminSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const STATUS_COLORS = {
  PAID: "badge-green",
  PENDING: "badge-yellow",
  FAILED: "badge-red",
  CANCELLED: "badge-red",
};

export default function EnrollmentsPage() {
  const dispatch = useDispatch();
  const { enrollments, loading } = useSelector((s) => s.admin);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchEnrollments({ page, status }));
  }, [dispatch, page, status]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Enrollments
          </h1>
          <p className="text-gray-500 text-sm">
            {enrollments?.total || 0} total enrollments
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="input-field max-w-48"
        >
          <option value="">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {[
                      "Enrollment ID",
                      "Student",
                      "Email",
                      "Course",
                      "Amount",
                      "Status",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrollments?.items?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-gray-400"
                      >
                        No enrollments found
                      </td>
                    </tr>
                  ) : (
                    enrollments?.items?.map((e) => (
                      <tr
                        key={e.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-primary-700">
                          {e.enrollmentId}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {e.studentName}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {e.studentEmail}
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-36 truncate">
                          {e.courseTitle}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          ₹{e.amount?.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`badge ${STATUS_COLORS[e.paymentStatus] || "badge-blue"}`}
                          >
                            {e.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {new Date(e.enrolledAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {enrollments?.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Page {enrollments?.page} of {enrollments?.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={page === enrollments?.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
