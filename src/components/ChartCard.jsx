import React, { useState } from "react";

const ReloadButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-1.5 text-text-muted hover:text-brand hover:bg-surface-hover rounded-full transition-colors"
    title="Reload Chart"
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  </button>
);

export default function ChartCard({ title, children, className = "" }) {
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleReload = () => setReloadTrigger((prev) => prev + 1);

  return (
    <div
      className={`bg-panel-bg rounded-xl shadow-sm border border-panel-border p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text-main">{title}</h3>
        <ReloadButton onClick={handleReload} />
      </div>
      {typeof children === "function" ? children(reloadTrigger) : children}
    </div>
  );
}
