import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../context/ThemeContext';

const DivergingBarChart = ({ 
    data, 
    dataUrl, 
    width = 600, 
    height = 400, 
    margin = { top: 20, right: 30, bottom: 40, left: 100 }, 
    reloadTrigger = 0,
    highlightLabel = null // Optional: highlight this label
}) => {
  const svgRef = useRef(null);
  const { theme } = useTheme();
  
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const textColor = isDarkMode ? '#e2e8f0' : '#475569';

  useEffect(() => {
    const renderChart = (chartData) => {
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

        // X scale (Percentage)
        // Find absolute max to center 0 perfectly if desired, or just use extent
        const maxAbs = d3.max(chartData, d => Math.abs(d.value));
        const x = d3.scaleLinear()
        .domain([-maxAbs, maxAbs])
        .range([0, innerWidth]);

        // Y scale (Categories)
        const y = d3.scaleBand()
        .range([0, innerHeight])
        .domain(chartData.map(d => d.label))
        .padding(0.2);

        // Add X axis
        const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("+.0%")));
        
        xAxis.selectAll("text").style("fill", textColor);
        xAxis.selectAll("line, .domain").style("stroke", textColor).style("opacity", 0.3);

        // Add Y axis (The "middle" vertical axis)
        // We want a line at x=0
        svg.append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y1", 0)
            .attr("y2", innerHeight)
            .attr("stroke", textColor) // Gray-600
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4")
            .style("opacity", 0.5);

        // Add Category Labels on the left (or intelligently placed)
        // Standard left axis for readability
        const yAxis = svg.append("g")
        .call(d3.axisLeft(y).tickSize(0));
        
        yAxis.select(".domain").remove();
        yAxis.selectAll("text").style("fill", textColor);
        
        // Animation Duration
        const animDuration = 1000;

        // Bars
        svg.selectAll("rect")
        .data(chartData)
        .enter()
        .append("rect")
        .attr("x", x(0)) // Start at 0
        .attr("y", d => y(d.label))
        .attr("height", y.bandwidth())
        .attr("width", 0) // Start with 0 width
        .attr("fill", d => {
            if (highlightLabel && d.label.toLowerCase() === highlightLabel.toLowerCase()) {
                return d.value > 0 ? "#10b981" : "#ef4444";
            }
            return d.value > 0 ? "#10b98188" : "#ef444488"; // Semi-transparent if not highlighted
        })
        .attr("stroke", d => (highlightLabel && d.label.toLowerCase() === highlightLabel.toLowerCase()) ? (isDarkMode ? "white" : "#1e293b") : "none")
        .attr("stroke-width", 2)
        .transition()
        .duration(animDuration)
        .attr("x", d => Math.min(x(0), x(d.value)))
        .attr("width", d => Math.abs(x(d.value) - x(0)));

        // Add value labels on bars
        svg.selectAll(".label")
            .data(chartData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => d.value < 0 ? x(d.value) - 5 : x(d.value) + 5)
            .attr("y", d => y(d.label) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.value < 0 ? "end" : "start")
            .text(d => d3.format("+.1%")(d.value))
            .style("fill", textColor) // Gray-400
            .style("font-size", "10px")
            .style("opacity", 0)
            .transition()
            .delay(animDuration)
            .duration(500)
            .style("opacity", 1);
    };

    if (dataUrl) {
        d3.csv(dataUrl).then(rawData => {
            // Assume format: label, value
            const processedData = rawData.map(d => ({
                label: d.label,
                value: +d.value
            }));
            renderChart(processedData);
        });
    } else {
        renderChart(data);
    }

  }, [data, dataUrl, width, height, margin, reloadTrigger, highlightLabel, theme, textColor, isDarkMode]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default DivergingBarChart;
