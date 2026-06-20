import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchEmailLogs, retryEmail } from "../../store/slices/adminSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const STATUS_COLORS = {
  SENT: "badge-green",
  FAILED: "badge-red",
  PENDING: "badge-yellow",
};

export default function EmailLogsPage() {
  const dispatch = useDispatch();
  const { emailLogs, loading } = useSelector((s) => s.admin);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchEmailLogs({ page, status }));
  }, [dispatch, page, status]);

  const handleRetry = async (logId) => {
    const result = await dispatch(retryEmail(logId));
    if (retryEmail.fulfilled.match(result)) {
      toast.success("Retry queued");
      dispatch(fetchEmailLogs({ page, status }));
    } else {
      toast.error("Retry failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Email Logs
          </h1>
          <p className="text-gray-500 text-sm">
            {emailLogs?.total || 0} total emails
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
          <option value="SENT">Sent</option>
          <option value="FAILED">Failed</option>
          <option value="PENDING">Pending</option>
        </select>
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
                    "Recipient",
                    "Type",
                    "Subject",
                    "Status",
                    "Retries",
                    "Sent At",
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
                {emailLogs?.items?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      No email logs found
                    </td>
                  </tr>
                ) : (
                  emailLogs?.items?.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-700">
                        {log.recipient}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {log.emailType}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-48 truncate">
                        {log.subject || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge ${STATUS_COLORS[log.status] || "badge-blue"}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {log.retryCount || 0}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {log.sentAt
                          ? new Date(log.sentAt).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {log.status === "FAILED" && (
                          <button
                            onClick={() => handleRetry(log.id)}
                            className="text-xs text-primary-600 hover:underline font-medium"
                          >
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
