import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchDashboard } from "../../store/slices/adminSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const STAT_CARDS = (stats) => [
  {
    label: "Total Enrollments",
    value: stats?.enrollments?.total || 0,
    icon: "📋",
    color: "bg-blue-50 text-blue-700",
    border: "border-blue-200",
  },
  {
    label: "Paid Enrollments",
    value: stats?.enrollments?.paid || 0,
    icon: "✅",
    color: "bg-green-50 text-green-700",
    border: "border-green-200",
  },
  {
    label: "Total Revenue",
    value: `₹${(stats?.revenue?.totalRevenue || 0).toLocaleString("en-IN")}`,
    icon: "💰",
    color: "bg-amber-50 text-amber-700",
    border: "border-amber-200",
  },
  {
    label: "Total Students",
    value: stats?.totalStudents || 0,
    icon: "👥",
    color: "bg-purple-50 text-purple-700",
    border: "border-purple-200",
  },
  {
    label: "Active Courses",
    value: stats?.activeCourses || 0,
    icon: "🎓",
    color: "bg-indigo-50 text-indigo-700",
    border: "border-indigo-200",
  },
  {
    label: "Pending Payments",
    value: stats?.enrollments?.pending || 0,
    icon: "⏳",
    color: "bg-orange-50 text-orange-700",
    border: "border-orange-200",
  },
];

const PIE_COLORS = ["#2e7d32", "#1565c0", "#c62828"];

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading && !stats) return <LoadingSpinner />;

  const enrStats = stats?.enrollments;
  const pieData = enrStats
    ? [
        { name: "Paid", value: enrStats.paid },
        { name: "Pending", value: enrStats.pending },
        { name: "Failed", value: enrStats.failed },
      ]
    : [];

  const barData = [
    { name: "Paid", count: enrStats?.paid || 0 },
    { name: "Pending", count: enrStats?.pending || 0 },
    { name: "Failed", count: enrStats?.failed || 0 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of UPX Global platform activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS(stats).map(({ label, value, icon, color, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-white rounded-2xl p-5 border ${border} shadow-card`}
          >
            <div
              className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-xl mb-3`}
            >
              {icon}
            </div>
            <p className="text-2xl font-display font-bold text-gray-900">
              {value}
            </p>
            <p className="text-gray-500 text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">
            Enrollment Status
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3f51b5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">
            Payment Distribution
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "View Students", to: "../students", icon: "👥" },
          { label: "Enrollments", to: "../enrollments", icon: "📋" },
          { label: "Manage Courses", to: "../courses", icon: "🎓" },
          { label: "View Payments", to: "../payments", icon: "💳" },
        ].map(({ label, to, icon }) => (
          <a
            key={label}
            href={to}
            className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:shadow-lifted transition-shadow group"
          >
            <span className="text-2xl">{icon}</span>
            <span className="font-medium text-gray-800 text-sm group-hover:text-primary-700">
              {label}
            </span>
            <span className="ml-auto text-gray-300 group-hover:text-primary-500">
              →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
