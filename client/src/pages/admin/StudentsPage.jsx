import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../../store/slices/adminSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function StudentsPage() {
  const dispatch = useDispatch();
  const { students, loading } = useSelector((s) => s.admin);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchStudents({ page, search }));
  }, [dispatch, page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Students
          </h1>
          <p className="text-gray-500 text-sm">
            {students?.total || 0} total students
          </p>
        </div>
        <input
          type="search"
          placeholder="Search by email..."
          value={search}
          onChange={handleSearch}
          className="input-field max-w-xs"
        />
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
                      "Name",
                      "Email",
                      "Phone",
                      "College",
                      "Degree",
                      "City",
                      "Joined",
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
                  {students?.items?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-gray-400"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students?.items?.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {s.name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.email}</td>
                        <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-32 truncate">
                          {s.collegeName}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.degree}</td>
                        <td className="px-4 py-3 text-gray-600">{s.city}</td>
                        <td className="px-4 py-3 text-gray-400">
                          {new Date(s.createdAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {students?.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Page {students?.page} of {students?.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={page === students?.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors"
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
