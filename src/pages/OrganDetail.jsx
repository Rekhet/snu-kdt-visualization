import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bodyPartsData } from "../data/bodyParts";
import { sketchfabModels } from "../data/sketchfabModels";
import { cancerData } from "../data/cancerData";
import LineChart from "../components/LineChart";
import DivergingBarChart from "../components/DivergingBarChart";
import HeatmapChart from "../components/HeatmapChart";
import {
  cancerMapping,
  heatmapMapping,
  divergingMapping,
} from "../data/chartDataMapping";

export default function OrganDetail() {
  const { organId } = useParams();
  const navigate = useNavigate();
  const partData = bodyPartsData.find((p) => p.id === organId);
  const modelUrl = sketchfabModels[organId];
  const cData = cancerData[organId];

  if (!partData) {
    return (
      <div className="p-10 text-center text-text-muted">Organ not found</div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-app-bg text-text-main transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-panel-bg border-b border-panel-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-text-muted hover:text-text-main transition"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Atlas
          </button>
          <h1 className="text-xl font-bold border-l border-panel-border pl-4">
            {partData.label} Oncology Profile
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* 3D View (Sketchfab Embed) */}
        <div className="flex-1 relative bg-app-bg flex items-center justify-center overflow-hidden">
          {modelUrl ? (
            <iframe
              title={`${partData.label} 3D Model`}
              className="w-full h-full border-none"
              src={modelUrl}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
            ></iframe>
          ) : (
            <div className="flex flex-col items-center text-text-muted">
              <svg
                className="w-16 h-16 mb-4 opacity-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
              <p>No detailed 3D model available for this section.</p>
            </div>
          )}

          {/* Overlay hint */}
          {modelUrl && (
            <div className="absolute bottom-4 left-4 text-xs text-text-muted font-mono bg-panel-bg/80 backdrop-blur-sm px-2 py-1 rounded border border-panel-border pointer-events-none">
              Powered by Sketchfab
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="w-96 bg-panel-bg border-l border-panel-border overflow-y-auto z-10 shadow-xl">
          <div className="p-6 border-b border-panel-border">
            <h2 className="text-2xl font-bold mb-2">{partData.label}</h2>
            <span className="inline-block bg-brand/20 text-brand text-xs px-2 py-0.5 rounded-full mb-4 uppercase tracking-wider font-semibold">
              {partData.type}
            </span>
            <p className="text-text-muted leading-relaxed text-sm">
              {partData.description}
            </p>
          </div>

          {cData ? (
            <div className="p-6 space-y-8 pb-12">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-input-bg p-3 rounded-lg">
                  <span className="block text-xs text-text-muted uppercase tracking-wide">
                    Incidence
                  </span>
                  <span className="font-bold text-brand">
                    {cData.stats.incidence}
                  </span>
                </div>
                <div className="bg-input-bg p-3 rounded-lg">
                  <span className="block text-xs text-text-muted uppercase tracking-wide">
                    Survival (5yr)
                  </span>
                  <span className="font-bold text-success">
                    {cData.stats.survival}
                  </span>
                </div>
              </div>

              {/* Statistical Trends */}
              {cancerMapping[organId] && (
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-brand"
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
                    Incidence by Age Group
                  </h3>
                  <div className="bg-input-bg p-2 rounded-lg overflow-hidden h-48">
                    <LineChart
                      dataUrl="/data/cancer_24_age5.csv"
                      selectedSeries={cancerMapping[organId]}
                      width={340}
                      height={180}
                      margin={{ top: 10, right: 10, bottom: 25, left: 35 }}
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-2 italic">
                    Data source: National Cancer Registry (Incidence per 100k)
                  </p>
                </div>
              )}

              {/* Survival Comparison */}
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                  Survival Rate Change (%)
                </h3>
                <div className="bg-input-bg p-2 rounded-lg overflow-hidden h-64">
                  <DivergingBarChart
                    dataUrl="/data/diverging-data.csv"
                    highlightLabel={divergingMapping[organId]}
                    width={340}
                    height={240}
                    margin={{ top: 10, right: 30, bottom: 40, left: 70 }}
                  />
                </div>
              </div>

              {/* Treatment Efficacy */}
              {heatmapMapping[organId] && (
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                    Treatment Efficacy Score
                  </h3>
                  <div className="bg-input-bg p-2 rounded-lg overflow-hidden h-40">
                    <HeatmapChart
                      dataUrl="/data/heatmap-data.csv"
                      selectedY={heatmapMapping[organId]}
                      width={340}
                      height={140}
                      margin={{ top: 30, right: 10, bottom: 30, left: 60 }}
                    />
                  </div>
                </div>
              )}

              {/* Risk Factors */}
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-red-500"
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
                  Risk Factors
                </h3>
                <ul className="space-y-2">
                  {cData.riskFactors.map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-2 text-sm text-text-main"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-text-muted/50 flex-shrink-0"></span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Symptoms */}
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-brand"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  Common Symptoms
                </h3>
                <ul className="space-y-2">
                  {cData.symptoms.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2 text-sm text-text-main"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-text-muted/50 flex-shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatments */}
              <div className="pb-6">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    ></path>
                  </svg>
                  Standard Treatments
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cData.treatment.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-surface-hover text-text-main px-2 py-1 rounded border border-panel-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 pb-12">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                Common Pathologies
              </h3>
              <ul className="space-y-2">
                {partData.diseases.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2 text-sm text-text-main"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
