import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../store/slices/adminSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const STATUS_COLORS = {
  CAPTURED: "badge-green",
  CREATED: "badge-yellow",
  FAILED: "badge-red",
  REFUNDED: "badge-blue",
};

export default function PaymentsPage() {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((s) => s.admin);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPayments({ page, status }));
  }, [dispatch, page, status]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">
            Payments
          </h1>
          <p className="text-gray-500 text-sm">
            {payments?.total || 0} total transactions
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
          <option value="CAPTURED">Captured (Success)</option>
          <option value="FAILED">Failed</option>
          <option value="CREATED">Created</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Transactions",
            value: payments?.total || 0,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Successful",
            value: (payments?.items || []).filter(
              (p) => p.status === "CAPTURED",
            ).length,
            color: "bg-green-50 text-green-700",
          },
          {
            label: "Failed",
            value: (payments?.items || []).filter((p) => p.status === "FAILED")
              .length,
            color: "bg-red-50 text-red-700",
          },
          {
            label: "Pending",
            value: (payments?.items || []).filter((p) => p.status === "CREATED")
              .length,
            color: "bg-yellow-50 text-yellow-700",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`rounded-2xl p-4 ${color} border border-current/10`}
          >
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs mt-1 opacity-70">{label}</p>
          </div>
        ))}
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
                    "Payment ID",
                    "Enrollment ID",
                    "Transaction ID",
                    "Amount",
                    "Currency",
                    "Status",
                    "Gateway",
                    "Date",
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
                {payments?.items?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-gray-400"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments?.items?.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {p.id}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-primary-700">
                        {p.enrollmentId}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {p.transactionId || "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        ₹{p.amount?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.currency}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge ${STATUS_COLORS[p.status] || "badge-blue"}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600">
                        {p.gatewayProvider}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {p.paymentDate
                          ? new Date(p.paymentDate).toLocaleDateString("en-IN")
                          : new Date(p.createdAt).toLocaleDateString("en-IN")}
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
