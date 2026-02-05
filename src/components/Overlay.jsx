import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { bodyPartsData } from "../data/bodyParts";
import { useNavigate } from "react-router-dom";
import LineChart from "./LineChart";
import { cancerMapping } from "../data/chartDataMapping";

export default function Overlay({ selectedId, onSelect, hoveredPart }) {
  const selectedPart = bodyPartsData.find((p) => p.id === selectedId);
  const hoveredPartData = bodyPartsData.find((p) => p.id === hoveredPart);
  const navigate = useNavigate();

  const tooltipRef = React.useRef(null);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (tooltipRef.current) {
        // Offset by 15px so it doesn't block the cursor
        tooltipRef.current.style.transform = `translate(${e.clientX + 15}px, ${e.clientY + 15}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 z-10">
      {/* Custom Cursor Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-200 ${hoveredPartData ? "opacity-100" : "opacity-0"}`}
      >
        <div className="bg-panel-bg-blur backdrop-blur-sm text-text-main text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg border border-panel-border whitespace-nowrap">
          {hoveredPartData?.label || hoveredPart}
        </div>
      </div>

      {/* Info Card & Controls Container */}
      <div className="flex items-end justify-between w-full">
        {/* Controls / Hints */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Removed Rotate & Zoom hint */}
        </div>

        {/* Info Card - Slides up when active */}
        <AnimatePresence>
          {selectedPart && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-[28rem] bg-panel-bg-blur border border-panel-border p-0 rounded-2xl backdrop-blur-xl shadow-2xl text-text-main overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="bg-brand/10 px-6 py-4 border-b border-brand/20 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-text-main">
                    {selectedPart.label}
                  </h2>
                  <span className="text-xs font-semibold text-brand bg-brand/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedPart.type}
                  </span>
                </div>
                <button
                  onClick={() => onSelect(null)}
                  className="text-text-muted hover:text-text-main hover:bg-surface-hover rounded-full p-1 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-text-muted text-sm mb-6 leading-relaxed">
                  {selectedPart.description}
                </p>

                {/* Quick Stats Chart */}
                {cancerMapping[selectedId] && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                      <svg
                        className="w-3 h-3 text-brand"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        ></path>
                      </svg>
                      Incidence Trend (Age)
                    </h3>
                    <div className="bg-input-bg/50 p-2 rounded-xl h-36">
                      <LineChart
                        dataUrl="/data/cancer_24_age5.csv"
                        selectedSeries={cancerMapping[selectedId]}
                        width={380}
                        height={130}
                        margin={{ top: 10, right: 10, bottom: 25, left: 35 }}
                      />
                    </div>
                  </div>
                )}

                {/* Detailed Views Navigation */}
                {selectedPart.details && selectedPart.details.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                      Explore Details
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPart.details.map((detailId) => {
                        const detailPart = bodyPartsData.find(
                          (d) => d.id === detailId,
                        );
                        if (!detailPart) return null;
                        return (
                          <button
                            key={detailId}
                            onClick={() => navigate(`/organ/${detailId}`)}
                            className="text-xs bg-brand hover:bg-brand-dark text-text-inverse px-3 py-1.5 rounded-md shadow-sm transition font-medium flex items-center gap-1"
                          >
                            View {detailPart.label}
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      ></path>
                    </svg>
                    Associated Conditions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPart.diseases.map((d) => (
                      <span
                        key={d}
                        className="text-xs bg-surface-hover text-text-muted px-3 py-1.5 rounded-md border border-panel-border hover:border-brand hover:bg-brand/10 hover:text-brand transition cursor-default font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
