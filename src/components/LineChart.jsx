import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../context/ThemeContext';

const LineChart = ({ 
    data, 
    dataUrl, 
    width = 600, 
    height = 400, 
    margin = { top: 20, right: 30, bottom: 30, left: 40 }, 
    reloadTrigger = 0,
    // CSV Parsing Options
    headerRowIndex = 0,
    dataRowIndex = 1,
    xColumnIndex = 0,
    seriesStartColumnIndex = 1,
    selectedSeries = null // Optional: filter to show only this series name
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const { theme } = useTheme();
  
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const textColor = isDarkMode ? '#e2e8f0' : '#475569'; // Slate-200 vs Slate-600

  useEffect(() => {
    const renderChart = (chartData) => {
        // chartData structure: Array of Series: { color, label, values: [{x, y, originalX}] }
        // We need to normalize data structure
        if (!chartData || chartData.length === 0) return;

        // Clear previous render
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Flatten points for scales and Voronoi
        const allPoints = chartData.flatMap(s => s.values.map(v => ({ ...v, series: s.label || "Series" })));

        // Determine X Scale Type
        const isNumericX = allPoints.every(d => typeof d.x === 'number' && !isNaN(d.x));
        
        let x;
        if (isNumericX) {
            x = d3.scaleLinear()
                .domain(d3.extent(allPoints, d => d.x))
                .range([0, innerWidth]);
        } else {
            // Categorical / Ordinal
            const xDomain = Array.from(new Set(allPoints.map(d => d.x))); // Preserve order?
            x = d3.scalePoint()
                .domain(xDomain)
                .range([0, innerWidth]);
        }

        // Y scale
        const y = d3.scaleLinear()
        .domain([0, d3.max(allPoints, d => d.y)])
        .range([innerHeight, 0]);

        // Add X axis
        const xAxis = svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));
        
        xAxis.selectAll("text").style("fill", textColor);
        xAxis.selectAll("line, .domain").style("stroke", textColor).style("opacity", 0.3);

        // Add Y axis
        const yAxis = svg.append("g")
        .call(d3.axisLeft(y));

        yAxis.selectAll("text").style("fill", textColor);
        yAxis.selectAll("line, .domain").style("stroke", textColor).style("opacity", 0.3);

        // Line generator
        const line = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));
        
        // Handle categorical X in line generator (if numeric, d.x works, if scalePoint, x(d.x) works)

        // Draw Lines
        const lines = svg.selectAll(".line")
            .data(chartData)
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", (d, i) => d.color || d3.schemeCategory10[i % 10])
            .attr("stroke-width", 2)
            .attr("d", d => line(d.values));
        
        // Animation
        const lineDuration = 1500;
        lines.each(function() {
            const path = d3.select(this);
            const totalLength = path.node().getTotalLength();
            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(lineDuration)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        });

        // Interaction: Voronoi / Delaunay
        // Create an overlay for mouse events
        const overlay = svg.append("rect")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .style("fill", "none")
            .style("pointer-events", "all");

        // Points for Delaunay: [x_pixel, y_pixel]
        // Filter out any bad points just in case
        const validPoints = allPoints.filter(d => y(d.y) !== undefined && x(d.x) !== undefined);
        const delaunay = d3.Delaunay.from(validPoints, d => x(d.x), d => y(d.y));
        
        // Highlight Circle
        const highlightCircle = svg.append("circle")
            .attr("r", 4)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .style("display", "none");

        const tooltip = d3.select(tooltipRef.current);

        overlay.on("mousemove", (event) => {
            const [mx, my] = d3.pointer(event);
            const index = delaunay.find(mx, my);
            
            if (index !== null) {
                const d = validPoints[index];
                const px = x(d.x);
                const py = y(d.y);

                // Show Highlight
                highlightCircle
                    .attr("cx", px)
                    .attr("cy", py)
                    .attr("fill", d3.schemeCategory10[chartData.findIndex(s => s.label === d.series) % 10] || "steelblue")
                    .style("display", "block");

                // Update Tooltip
                // We want it following the cursor, usually offset slightly
                // Note: using clientX/Y for fixed positioning
                tooltip
                    .style("display", "block")
                    .style("left", (event.clientX + 15) + "px")
                    .style("top", (event.clientY - 15) + "px")
                    .html(`
                        <div class="font-bold text-xs mb-1">${d.series}</div>
                        <div class="text-xs">Age Group: ${d.originalX || d.x}</div>
                        <div class="text-xs">Count: ${d.y.toLocaleString()}</div>
                    `);
            }
        });

        overlay.on("mouseleave", () => {
            highlightCircle.style("display", "none");
            tooltip.style("display", "none");
        });
    };

    if (dataUrl) {
        d3.text(dataUrl).then(text => {
            const rows = d3.csvParseRows(text);
            
            if (rows.length < dataRowIndex + 1) return;

            // Header Row
            const headerRow = rows[headerRowIndex];
            const seriesNames = headerRow.slice(seriesStartColumnIndex);
            
            // Initialize Data Structure
            // Map seriesIndex -> { label, values: [] }
            const seriesData = seriesNames.map((label, i) => ({
                label: label || `Series ${i}`,
                values: []
            }));

            // Parse Data Rows
            for (let i = dataRowIndex; i < rows.length; i++) {
                const row = rows[i];
                const xValRaw = row[xColumnIndex];
                
                // Try to parse X as number
                let xVal = +xValRaw;
                if (isNaN(xVal)) xVal = xValRaw; // Keep as string if NaN

                for (let j = 0; j < seriesNames.length; j++) {
                    const colIndex = seriesStartColumnIndex + j;
                    if (colIndex < row.length) {
                        let valStr = row[colIndex] || "0";
                        valStr = valStr.replace(/-/g, "0").replace(/,/g, ""); 
                        const yVal = +valStr;

                        seriesData[j].values.push({
                            x: xVal,
                            originalX: xValRaw, // Keep original label
                            y: yVal
                        });
                    }
                }
            }
            
            // Assign colors
            const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
            seriesData.forEach(s => s.color = colorScale(s.label));

            const filteredData = selectedSeries 
                ? seriesData.filter(s => s.label === selectedSeries)
                : seriesData;

            renderChart(filteredData);
        });
    } else if (data) {
        // Adapt existing data format { color, values: [{x,y}] } to { label, color, values }
        // If data already has label, great. If not, add dummy.
        // Assuming data is array of series.
        const adaptedData = data.map((s, i) => ({
            ...s,
            label: s.label || `Series ${i}`,
            // values already {x,y}
        }));

        const filteredData = selectedSeries 
            ? adaptedData.filter(s => s.label === selectedSeries)
            : adaptedData;

        renderChart(filteredData);
    }

  }, [data, dataUrl, width, height, margin, reloadTrigger, headerRowIndex, dataRowIndex, xColumnIndex, seriesStartColumnIndex, selectedSeries, theme, textColor]);

  return (
    <>
        <svg ref={svgRef}></svg>
        <div 
            ref={tooltipRef} 
            className="fixed bg-gray-800/90 text-white p-3 rounded shadow-lg pointer-events-none z-50 backdrop-blur-sm transition-opacity duration-75 border border-gray-700"
            style={{ display: 'none' }}
        />
    </>
  );
};

export default LineChart;
