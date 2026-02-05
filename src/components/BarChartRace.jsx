import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

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

  // 1. Load Data
  useEffect(() => {
    d3.csv("/data/death_cause_num.csv").then(() => {
      return d3.text("/data/death_cause_num.csv");
    }).then(text => {
      const rows = d3.csvParseRows(text);
      
      const yearRow = rows[0];
      const extractedYears = yearRow.slice(3).map(y => +y);
      setYears(extractedYears);

      const cancerRows = rows.slice(2).filter(r => {
        const label = r[0];
        return label && label.includes("(C") && !label.includes("(C00-C97)");
      });

      const formatted = cancerRows.map(row => {
        const label = row[0].split("(")[0].trim(); 
        const values = row.slice(3).map(v => {
            const num = +v.replace(/,/g, ''); 
            return isNaN(num) ? 0 : num;
        });
        return { label, values };
      });
      
      setData(formatted);

      // Create stable color map
      const allLabels = formatted.map(d => d.label);
      const scale = d3.scaleOrdinal(d3.schemeTableau10).domain(allLabels);
      const map = {};
      allLabels.forEach(l => map[l] = scale(l));
      setColorMap(map);
    });
  }, []);

  // 2. Render / Update based on Progress
  useEffect(() => {
    if (!data || !years.length || !svgRef.current) return;

    // Pause Logic: Hold start for 10%, Hold end for 10%
    const PAUSE = 0.1; 
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
    .slice(0, 10); 

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
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#e5e7eb"); 

    // Labels (Value)
    g.selectAll(".label-value")
        .data(currentData, d => d.label)
        .join("text")
        .attr("class", "label-value")
        .attr("x", d => x(d.value) + 5)
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => Math.round(d.value).toLocaleString())
        .style("font-size", "12px")
        .style("fill", "#9ca3af"); 

    // Year Label
    const displayYear = Math.floor(years[0] + effectiveProgress * (years[years.length-1] - years[0]));
    g.append("text")
        .attr("x", innerWidth)
        .attr("y", innerHeight - 20)
        .attr("text-anchor", "end")
        .style("font-size", "48px")
        .style("font-weight", "bold")
        .style("fill", "#6b7280") 
        .style("opacity", 0.5)
        .text(displayYear);

  }, [data, years, progress, width, height, margin, colorMap]);

  if (!visible || progress >= 1 || progress <= 0) return null;

  // Calculate display year for header outside of D3 logic
  const displayYearHeader = years.length > 0 
     ? Math.floor(years[0] + (progress < 0.1 ? 0 : progress > 0.9 ? 1 : (progress - 0.1) / 0.8) * (years[years.length-1] - years[0]))
     : "";

  return (
    <div className="bg-panel-bg/80 backdrop-blur-md border border-panel-border rounded-xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-text-main mb-4 flex justify-between items-center">
            <span>Leading Causes of Cancer Death</span>
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
