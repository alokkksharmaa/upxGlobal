import React from "react";

export default function LoadingSpinner({
  fullScreen = false,
  overlay = false,
  size = "md",
}) {
  const sizes = { sm: "w-5 h-5", md: "w-10 h-10", lg: "w-16 h-16" };

  const spinner = (
    <div
      className={`${sizes[size]} border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-primary-600 text-sm font-medium animate-pulse">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-lifted">
          {spinner}
          <p className="text-gray-700 text-sm font-medium">
            Processing payment…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{spinner}</div>
  );
}
