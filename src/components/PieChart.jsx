import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useTheme } from "../context/ThemeContext";

const PieChart = ({
  data,
  dataUrl,
  width = 400,
  height = 400,
  reloadTrigger = 0,
}) => {
  const svgRef = useRef(null);
  const { theme } = useTheme();

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const textColor = isDarkMode ? "#e2e8f0" : "#475569";

  useEffect(() => {
    const renderChart = (chartData) => {
      if (!chartData || chartData.length === 0) return;

      // Clear previous render
      d3.select(svgRef.current).selectAll("*").remove();

      const radius = Math.min(width, height) / 2;
      const innerRadius = 0; // Start from middle

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      // Scales
      const maxVal = d3.max(chartData, (d) => d.value);

      const radiusScale = d3
        .scaleLinear()
        .domain([0, maxVal])
        .range([innerRadius, radius]);

      const color = d3
        .scaleOrdinal()
        .domain(chartData.map((d) => d.label))
        .range(d3.schemeCategory10);

      const anglePerSlice = (2 * Math.PI) / chartData.length;

      // Pre-calculate geometry
      const processedData = chartData.map((d, i) => ({
        ...d,
        startAngle: i * anglePerSlice,
        endAngle: (i + 1) * anglePerSlice,
        innerRadius: 0,
        targetRadius: radiusScale(d.value),
      }));

      // Arc Generator (generic)
      const arc = d3.arc();

      // Animation Duration
      const animDuration = 1500;
      const labelFadeDuration = 500;

      // Draw Slices
      const paths = svg
        .selectAll("path")
        .data(processedData)
        .enter()
        .append("path")
        .attr("fill", (d) => color(d.label))
        .style("opacity", 0.9);

      // Animate Radial Growth & Pan Open
      paths
        .transition()
        .duration(animDuration)
        .attrTween("d", function (d) {
          const iRadius = d3.interpolate(0, d.targetRadius);
          const iStart = d3.interpolate(0, d.startAngle);
          const iEnd = d3.interpolate(0, d.endAngle);

          return function (t) {
            return arc({
              innerRadius: 0,
              outerRadius: iRadius(t),
              startAngle: iStart(t),
              endAngle: iEnd(t),
            });
          };
        })
        .on("end", (d, i, nodes) => {
          if (i === nodes.length - 1) {
            showLabels();
          }
        });

      // Prepare Labels
      const labels = svg
        .selectAll("text")
        .data(processedData)
        .enter()
        .append("text")
        .attr("transform", (d) => {
          // Calculate centroid for the fully grown arc
          const tempArc = d3
            .arc()
            .innerRadius(0)
            .outerRadius(d.targetRadius)
            .startAngle(d.startAngle)
            .endAngle(d.endAngle);

          // Move label slightly outside or to the edge
          const [x, y] = tempArc.centroid();
          // Push it out a bit further for readability
          const factor = 1.1;
          return `translate(${x * factor}, ${y * factor})`;
        })
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text((d) => d.label)
        .style("fill", textColor)
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .style("opacity", 0)
        .style("pointer-events", "none"); // Prevent interfering with mouse events

      function showLabels() {
        labels.transition().duration(labelFadeDuration).style("opacity", 1);
      }
    };

    if (dataUrl) {
      d3.csv(dataUrl).then((rawData) => {
        // Assume format: label,value
        const processedData = rawData.map((d) => ({
          label: d.label,
          value: +d.value,
        }));
        renderChart(processedData);
      });
    } else {
      renderChart(data);
    }
  }, [data, dataUrl, width, height, reloadTrigger, theme, textColor]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
