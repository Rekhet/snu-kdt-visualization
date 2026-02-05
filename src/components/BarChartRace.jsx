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

  // 1. Load Data
  useEffect(() => {
    d3.csv("/data/death_cause_num.csv").then(() => {
      // Structure is unique. Headers are on row 1 (index 0 for d3.csv if headers lines up)
      // But file has 3 header rows essentially. 
      // Actually d3.csv parses the first row as header.
      // Let's look at raw data again.
      // Row 0: "사망원인별(237항목)","성별","연령(5세)별",1983,1984...
      // Row 1: ... "사망자수 (명)" ...
      
      // We need to be careful parsing. 
      // Let's use d3.text to parse manually to be safe.
      return d3.text("/data/death_cause_num.csv");
    }).then(text => {
      const rows = d3.csvParseRows(text);
      
      // Row 0 has years from index 3
      const yearRow = rows[0];
      const extractedYears = yearRow.slice(3).map(y => +y);
      setYears(extractedYears);

      // Filter for Cancer rows
      // Identify rows where col 0 contains "(C" but NOT "(C00-C97)" (Total)
      const cancerRows = rows.slice(2).filter(r => {
        const label = r[0];
        return label && label.includes("(C") && !label.includes("(C00-C97)");
      });

      // Format data: { label: "Stomach Cancer", values: [12000, 12100, ...] }
      const formatted = cancerRows.map(row => {
        const label = row[0].split("(")[0].trim(); // Extract simplified name "위의 악성신생물"
        const values = row.slice(3).map(v => {
            const num = +v.replace(/,/g, ''); // Remove commas
            return isNaN(num) ? 0 : num;
        });
        return { label, values };
      });
      
      setData(formatted);
    });
  }, []);

  // 2. Render / Update based on Progress
  useEffect(() => {
    if (!data || !years.length || !svgRef.current) return;

    const currentYearIndexFloat = progress * (years.length - 1);
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
            color: d.color // We can assign colors later
        };
    })
    .sort((a, b) => b.value - a.value) // Sort descending
    .slice(0, 10); // Top 10

    // Assign consistent colors (hash based or mapped)
    // We want stable colors. 
    // Let's use a scale outside this effect or just hash string to color index
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    currentData.forEach(d => d.color = colorScale(d.label));

    // D3 Render Logic
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Ideally we use join for smooth transitions, 
    // but for scroll-scrubbing (high freq updates), simple redraw might flicker if not careful.
    // However, recreating elements every frame is bad for performance.
    // Let's try to stick to React for DOM or use D3 update pattern properly.
    
    // Actually, for a chart race with scrolling, we want smooth element movement.
    // Re-rendering SVG on every scroll frame is OK if count is low (10 bars).
    
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
        .data(currentData, d => d.label) // Key by label for object constancy? 
        // Note: For scroll scrubbing, we might just render by index if we sort them.
        // But true chart race has bars swapping positions.
        // If we clear and redraw sorted data, they just snap to new positions. 
        // For scrubbing, "snapping" to sorted order every frame is what we want. 
        // The "animation" is the user scrolling.
        .join("rect")
        .attr("x", x(0))
        .attr("y", (d, i) => y(i))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", y.bandwidth())
        .attr("fill", d => d.color)
        .attr("opacity", 0.9);

    // Labels (Name)
    g.selectAll(".label-name")
        .data(currentData)
        .join("text")
        .attr("class", "label-name")
        .attr("x", -10)
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d => d.label)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#e5e7eb"); // Tailwind gray-200

    // Labels (Value)
    g.selectAll(".label-value")
        .data(currentData)
        .join("text")
        .attr("class", "label-value")
        .attr("x", d => x(d.value) + 5)
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => Math.round(d.value).toLocaleString())
        .style("font-size", "12px")
        .style("fill", "#9ca3af"); // Tailwind gray-400

    // Year Label
    g.append("text")
        .attr("x", innerWidth)
        .attr("y", innerHeight - 20)
        .attr("text-anchor", "end")
        .style("font-size", "48px")
        .style("font-weight", "bold")
        .style("fill", "#6b7280") // Gray 500
        .style("opacity", 0.5)
        .text(Math.floor(years[indexFloor] + remainder)); // Show decimal year? Or just integer.
        // Math.floor(years[indexFloor] + remainder) -> just indexFloor year? 
        // Let's show integer year.
        // .text(years[indexFloor]); 

  }, [data, years, progress, width, height, margin]);

  if (!visible) return null;

  return (
    <div className="bg-panel-bg/80 backdrop-blur-md border border-panel-border rounded-xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-text-main mb-4 flex justify-between items-center">
            <span>Leading Causes of Cancer Death</span>
            <span className="text-brand text-2xl font-mono">
                {years.length > 0 && Math.floor(years[0] + progress * (years[years.length-1] - years[0]))}
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
