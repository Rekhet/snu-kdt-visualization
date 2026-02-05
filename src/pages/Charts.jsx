import React, { useState } from 'react';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import HeatmapChart from '../components/HeatmapChart';
import DivergingBarChart from '../components/DivergingBarChart';
import ChartCard from '../components/ChartCard';

export default function Charts() {
  const [lineData] = useState(() => {
    const points = 100;
    return [
      {
        color: "#3b82f6", // Blue
        values: Array.from({ length: points }, (_, i) => ({
          x: i,
          y: Math.sin(i * 0.1) * 30 + 50 + Math.random() * 5
        }))
      },
      {
        color: "#ef4444", // Red
        values: Array.from({ length: points }, (_, i) => ({
          x: i,
          y: Math.cos(i * 0.15) * 20 + 40 + Math.random() * 8
        }))
      },
      {
        color: "#10b981", // Green
        values: Array.from({ length: points }, (_, i) => ({
          x: i,
          y: (Math.sin(i * 0.05) + Math.cos(i * 0.2)) * 15 + 30 + Math.random() * 3
        }))
      },
      {
        color: "#f59e0b", // Amber
        values: Array.from({ length: points }, (_, i) => ({
          x: i,
          y: (Math.abs(Math.sin(i * 0.3)) * 40) + 10
        }))
      }
    ];
  });

  const [pieData] = useState([
    { label: "North America", value: 30 },
    { label: "Europe", value: 25 },
    { label: "Asia", value: 20 },
    { label: "Africa", value: 15 },
    { label: "Oceania", value: 10 }
  ]);

  const [heatmapData] = useState(() => {
    const groups = ["Chemo", "Rad", "Immuno", "Surg", "Target"];
    const vars = ["Lung", "Liver", "Brain", "Skin", "Bone"];
    const data = [];
    groups.forEach(g => {
        vars.forEach(v => {
            data.push({
                x: g,
                y: v,
                value: Math.floor(Math.random() * 100)
            });
        });
    });
    return data;
  });

  const [divergingData] = useState([
      { label: "Pancreas", value: -0.15 },
      { label: "Thyroid", value: 0.25 },
      { label: "Liver", value: -0.05 },
      { label: "Breast", value: 0.40 },
      { label: "Prostate", value: 0.10 },
      { label: "Lung", value: -0.12 },
      { label: "Stomach", value: -0.08 }
  ]);

  return (
    <div className="flex-1 w-full bg-app-bg p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-text-main sm:truncate sm:text-3xl sm:tracking-tight">
              Cancer Data Analytics
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Visualization of global cancer trends and disease statistics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <ChartCard title="Disease Prevalence by Region">
            {(reloadTrigger) => (
              <div className="flex items-center justify-center bg-input-bg rounded-lg p-4 overflow-hidden">
                <PieChart 
                  data={pieData} 
                  width={300} 
                  height={300} 
                  reloadTrigger={reloadTrigger}
                />
              </div>
            )}
          </ChartCard>

          {/* Heatmap Chart */}
          <ChartCard title="Treatment Efficacy Rates">
            {(reloadTrigger) => (
              <div className="flex items-center justify-center bg-input-bg rounded-lg p-4 overflow-hidden">
                <HeatmapChart 
                  data={heatmapData} 
                  width={400} 
                  height={300} 
                  reloadTrigger={reloadTrigger} 
                />
              </div>
            )}
          </ChartCard>
          
           {/* Line Chart */}
           <ChartCard title="Patient Recovery Timeline">
             {(reloadTrigger) => (
               <div className="w-full flex justify-center bg-input-bg rounded-lg p-4 overflow-hidden">
                  <LineChart 
                    data={lineData} 
                    width={400} 
                    height={300} 
                    reloadTrigger={reloadTrigger}
                  />
               </div>
             )}
          </ChartCard>

           {/* Diverging Bar Chart */}
           <ChartCard title="Survival Rate Change (YoY)">
             {(reloadTrigger) => (
               <div className="w-full flex justify-center bg-input-bg rounded-lg p-4 overflow-hidden">
                  <DivergingBarChart 
                    data={divergingData} 
                    width={400} 
                    height={300} 
                    reloadTrigger={reloadTrigger}
                  />
               </div>
             )}
          </ChartCard>

          <ChartCard title="연령별 암 발생자 수" className="md:col-span-2">
            {(reloadTrigger) => (
              <div className="w-full flex justify-center bg-input-bg rounded-lg p-4 overflow-hidden">
                <LineChart 
                  dataUrl="/data/cancer_24_age5.csv"
                  width={800} 
                  height={300} 
                  reloadTrigger={reloadTrigger}
                  headerRowIndex={0}
                  dataRowIndex={1}
                  xColumnIndex={0}
                  seriesStartColumnIndex={1}
                />
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
