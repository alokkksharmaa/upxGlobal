import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Public pages (code-split)
const HomePage = lazy(() => import("./pages/public/HomePage"));
const CoursesPage = lazy(() => import("./pages/public/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/public/CourseDetailPage"));
const EnrollmentPage = lazy(() => import("./pages/public/EnrollmentPage"));
const PaymentSuccessPage = lazy(
  () => import("./pages/public/PaymentSuccessPage"),
);
const PaymentFailedPage = lazy(
  () => import("./pages/public/PaymentFailedPage"),
);

// Admin pages (code-split)
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const StudentsPage = lazy(() => import("./pages/admin/StudentsPage"));
const EnrollmentsPage = lazy(() => import("./pages/admin/EnrollmentsPage"));
const AdminCoursesPage = lazy(() => import("./pages/admin/AdminCoursesPage"));
const PaymentsPage = lazy(() => import("./pages/admin/PaymentsPage"));
const EmailLogsPage = lazy(() => import("./pages/admin/EmailLogsPage"));

// ── Protected Route ─────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((s) => s.auth);
  return token ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/enroll/:courseId" element={<EnrollmentPage />} />
        <Route path="/enrollment/success" element={<PaymentSuccessPage />} />
        <Route path="/enrollment/failed" element={<PaymentFailedPage />} />
        <Route
          path="/enrollment/retry/:id"
          element={<EnrollmentPage isRetry />}
        />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin (protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="enrollments" element={<EnrollmentsPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="email-logs" element={<EmailLogsPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
