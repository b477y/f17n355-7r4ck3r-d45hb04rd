// src/components/Progress?Chart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ProgressChart = ({ progress, goal, title }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    // Create the SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Remove any existing chart
    svg.selectAll("*").remove();

    // Create the pie chart data
    const data = [progress, goal - progress];
    const color = d3.scaleOrdinal(["#388e3c", "#e0e0e0"]); // Colors for segments

    const arcGenerator = d3.arc()
      .innerRadius(70) // Inner radius for donut shape
      .outerRadius(radius - 10); // Outer radius

    const pieGenerator = d3.pie()
      .value(d => d)
      .sort(null); // Prevents sorting

    // Create the arcs
    const arcs = pieGenerator(data);
    svg.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d, i) => color(i))
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Add the title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2 - 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text(title);
  }, [progress, goal, title]);

  return <svg ref={svgRef} />;
};

export default ProgressChart;
