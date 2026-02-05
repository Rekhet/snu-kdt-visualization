import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const HeatmapChart = ({ 
    data, 
    dataUrl, 
    width = 600, 
    height = 400, 
    margin = { top: 30, right: 30, bottom: 30, left: 60 }, 
    reloadTrigger = 0,
    selectedY = null // Optional: filter to show only this Y-axis value (organ)
}) => {
  const svgRef = useRef(null);

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

        // Unique groups and vars
        const myGroups = Array.from(new Set(chartData.map(d => d.x)));
        const myVars = Array.from(new Set(chartData.map(d => d.y)));

        // Build X scales and axis
        const x = d3.scaleBand()
        .range([0, innerWidth])
        .domain(myGroups)
        .padding(0.05);

        // Build Y scales and axis
        const y = d3.scaleBand()
        .range([innerHeight, 0])
        .domain(myVars)
        .padding(0.05);

        const minVal = d3.min(chartData, d => d.value);
        const maxVal = d3.max(chartData, d => d.value);

        // Build color scale
        const myColor = d3.scaleSequential()
        .interpolator(d3.interpolateRgb("#dcfce7", "#991b1b"))
        .domain([minVal, maxVal]);

        // Draw Axes (initially hidden)
        const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x).tickSize(0))
        .style("opacity", 0);
        
        xAxis.select(".domain").remove();
        xAxis.selectAll("text").attr("transform", "translate(-10,0)rotate(-45)").style("text-anchor", "end");

        const yAxis = svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .style("opacity", 0);
        
        yAxis.select(".domain").remove();

        // Animation variables
        const axisDuration = 1000;
        const rectFadeInDuration = 500;
        const maxColorDuration = 2000;

        // Animate Axes Fade In
        xAxis.transition().duration(axisDuration).style("opacity", 1);
        yAxis.transition().duration(axisDuration).style("opacity", 1);

        // Draw Rects (initially hidden and set to minColor)
        const rects = svg.selectAll()
        .data(chartData, d => d.x + ':' + d.y)
        .enter()
        .append("rect")
        .attr("x", d => x(d.x))
        .attr("y", d => y(d.y))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", myColor(minVal)) // Start at lowest heat
        .attr("opacity", 0);

        // Animate Rects
        rects.transition()
        .delay(axisDuration) // Wait for axes
        .duration(rectFadeInDuration)
        .attr("opacity", 1)
        .on("end", function(d) {
            // Calculate duration proportional to value magnitude relative to min/max
            const range = maxVal - minVal;
            const fraction = range === 0 ? 0 : (d.value - minVal) / range;
            const duration = maxColorDuration * fraction;
            
            if (duration > 0) {
                d3.select(this).transition()
                    .duration(duration)
                    .ease(d3.easeLinear) // Linear speed to match "rising heat" consistent rate
                    .attrTween("fill", () => {
                        const i = d3.interpolate(minVal, d.value);
                        return (t) => myColor(i(t));
                    });
            }
        });
    };

    if (dataUrl) {
        d3.csv(dataUrl).then(rawData => {
            // Transform
            const transformedData = rawData.map(d => ({
                x: d.x,
                y: d.y,
                value: +d.value
            }));

            const filteredData = selectedY
                ? transformedData.filter(d => d.y.toLowerCase() === selectedY.toLowerCase())
                : transformedData;

            renderChart(filteredData);
        });
    } else if (data) {
        const filteredData = selectedY
            ? data.filter(d => d.y.toLowerCase() === selectedY.toLowerCase())
            : data;
        renderChart(filteredData);
    }
    
  }, [data, dataUrl, width, height, margin, reloadTrigger, selectedY]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default HeatmapChart;
