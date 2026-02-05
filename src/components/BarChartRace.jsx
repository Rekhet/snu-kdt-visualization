import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../context/ThemeContext';

const BarChartRace = ({ 
    width = 800, 
    height = 500, 
    margin = { top: 30, right: 30, bottom: 30, left: 200 },
    progress = 0, // 0 to 1 representing timeline
    visible = true
}) => {
  const svgRef = useRef(null);
  const [data, setData] = useState(null);
  const [years, setYears] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const { theme } = useTheme();
  
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const textColor = isDarkMode ? '#e2e8f0' : '#475569';

  // 1. Load Data
  useEffect(() => {
    d3.csv("/data/death_cause_num.csv").then(() => {
      return d3.text("/data/death_cause_num.csv");
    }).then(text => {
      const rows = d3.csvParseRows(text);
      
      const yearRow = rows[0];
      const extractedYears = yearRow.slice(3).map(y => +y);
      setYears(extractedYears);

      // Filter for all major death causes
      // Identify rows where col 0 contains specific alphanumeric codes in parentheses
      // and exclude "Re." (which often denote aggregates or remainders)
      const causeRows = rows.slice(2).filter(r => {
        const label = r[0];
        // Typical codes: (A00), (C16), (I21), etc. 
        // We want specific categories, avoiding the very broad ones if possible.
        // Actually, let's include anything with a code but filter out explicit aggregate strings.
        return label && label.includes("(") && !label.includes("Re.") && !label.includes("(C00-C97)") && !label.includes("(A00- B99)");
      });

      const formatted = causeRows.map(row => {
        const label = row[0].split("(")[0].trim(); 
        const values = row.slice(3).map(v => {
            const num = +v.replace(/,/g, '').replace(/-/g, '0'); 
            return isNaN(num) ? 0 : num;
        });
        return { label, values };
      });
      
      setData(formatted);

      // Create stable color map with a large unique palette
      const allLabels = formatted.map(d => d.label);
      const palette = [...d3.schemeTableau10, ...d3.schemePaired, ...d3.schemeSet3, ...d3.schemeCategory10, ...d3.schemeAccent];
      const scale = d3.scaleOrdinal(palette).domain(allLabels);
      const map = {};
      allLabels.forEach(l => map[l] = scale(l));
      setColorMap(map);
    });
  }, []);

  // 2. Render / Update based on Progress
  useEffect(() => {
    if (!data || !years.length || !svgRef.current) return;

    // Pause Logic: Hold start for 30%, Hold end for 30% (3x longer than before)
    const PAUSE = 0.3; 
    let effectiveProgress = 0;
    if (progress < PAUSE) effectiveProgress = 0;
    else if (progress > 1 - PAUSE) effectiveProgress = 1;
    else effectiveProgress = (progress - PAUSE) / (1 - 2 * PAUSE);

    const currentYearIndexFloat = effectiveProgress * (years.length - 1);
    const indexFloor = Math.floor(currentYearIndexFloat);
    const indexCeil = Math.ceil(currentYearIndexFloat);
    const remainder = currentYearIndexFloat - indexFloor;

    // Interpolate values
    const currentData = data.map(d => {
        const valFloor = d.values[indexFloor] || 0;
        const valCeil = d.values[indexCeil] || valFloor;
        const interpolated = valFloor + (valCeil - valFloor) * remainder;
        return {
            label: d.label,
            value: interpolated,
            color: colorMap[d.label] || "#ccc" // Use stable color
        };
    })
    .sort((a, b) => b.value - a.value) 
    .slice(0, 12); // Slightly more bars for "all causes"

    // D3 Render Logic
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(currentData, d => d.value) * 1.1])
        .range([0, innerWidth]);

    const y = d3.scaleBand()
        .domain(d3.range(currentData.length))
        .range([0, innerHeight])
        .padding(0.1);

    // Bars
    g.selectAll("rect")
        .data(currentData, d => d.label) 
        .join("rect")
        .attr("x", x(0))
        .attr("y", (d, i) => y(i))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", y.bandwidth())
        .attr("fill", d => d.color)
        .attr("opacity", 0.9);

    // Labels (Name)
    g.selectAll(".label-name")
        .data(currentData, d => d.label) // Key by label
        .join("text")
        .attr("class", "label-name")
        .attr("x", -10)
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d => d.label)
        .style("font-size", "11px") // Slightly smaller font for more bars
        .style("font-weight", "bold")
        .style("fill", textColor); 

    // Labels (Value)
    g.selectAll(".label-value")
        .data(currentData, d => d.label)
        .join("text")
        .attr("class", "label-value")
        .attr("x", d => x(d.value) + 5)
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => Math.round(d.value).toLocaleString())
        .style("font-size", "11px")
        .style("fill", isDarkMode ? "#9ca3af" : "#64748b"); 

    // Year Label
    const displayYear = Math.floor(years[0] + effectiveProgress * (years[years.length-1] - years[0]));
    g.append("text")
        .attr("x", innerWidth)
        .attr("y", innerHeight - 20)
        .attr("text-anchor", "end")
        .style("font-size", "48px")
        .style("font-weight", "bold")
        .style("fill", textColor) 
        .style("opacity", 0.3)
        .text(displayYear);

  }, [data, years, progress, width, height, margin, colorMap, theme, textColor, isDarkMode]);

  if (!visible || progress >= 1 || progress <= 0) return null;

  // Calculate display year for header outside of D3 logic
  const displayYearHeader = years.length > 0 
     ? Math.floor(years[0] + (progress < 0.3 ? 0 : progress > 0.7 ? 1 : (progress - 0.3) / 0.4) * (years[years.length-1] - years[0]))
     : "";

  return (
    <div className="bg-panel-bg/80 backdrop-blur-md border border-panel-border rounded-xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-text-main mb-4 flex justify-between items-center">
            <span>Leading Causes of Death (Historical)</span>
            <span className="text-brand text-2xl font-mono">
                {displayYearHeader}
            </span>
        </h3>
        <svg ref={svgRef} width={width} height={height} className="block"></svg>
        <p className="text-xs text-text-muted mt-2 text-right">
            Scroll to explore history ({years[0]} - {years[years.length-1]})
        </p>
    </div>
  );
};

export default BarChartRace;
