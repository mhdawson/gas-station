'use client'

import React from "react";
import * as d3 from 'd3';
import { useD3 } from './useD3';

function GasTank(data) {
  const ref = useD3(
    (svg) => {
      var currentTemp = data.data
      var defs = svg.append("defs");

      const okColor = "rgb(0,128,0)";
      const warningColor = "rgb(230,0,0)";
   
      svg.selectAll("svg > *").remove();

      const blackColor = "rgb(0,0,0)";

      let currentColor = okColor;
      let topOffset = 0;
      const open = true;
      if(open) {
        currentColor = warningColor;
        topOffset = -10; 
      }

      svg.append("rect")
        .attr("x", 37.5)
        .attr("y", 100)
        .attr("width",150) 
        .attr("height", 75)
        .style("shape-rendering", "crispEdges")
        .style("fill", currentColor)

      svg.append("circle")
        .attr("cx", 187.5)
        .attr("cy", 137.5)
        .attr("r", 37.5)
        .style("shape-rendering", "crispEdges")
        .style("fill", currentColor)

      svg.append("circle")
        .attr("cx", 37.5)
        .attr("cy", 137.5)
        .attr("r", 37.5)
        .style("shape-rendering", "crispEdges")
        .style("fill", currentColor)

      svg.append("rect")
        .attr("x", 45)
        .attr("y", 90)
        .attr("width",40) 
        .attr("height", 15)
        .style("shape-rendering", "crispEdges")
        .style("fill", currentColor)

      svg.append("rect")
        .attr("x", 135)
        .attr("y", 90)
        .attr("width",40) 
        .attr("height", 15)
        .style("shape-rendering", "crispEdges")
        .style("fill", currentColor)

      svg.append("rect")
        .attr("x", 135)
        .attr("y", 85 + topOffset)
        .attr("width",40) 
        .attr("height", 5)
        .style("shape-rendering", "crispEdges")
        .style("fill", blackColor)

      svg.append("rect")
        .attr("x", 45)
        .attr("y", 85)
        .attr("width",40) 
        .attr("height", 5)
        .style("shape-rendering", "crispEdges")
        .style("fill", blackColor)
    }, 
    [data]
  );  

  return (
    <svg
      ref={ref}
      style={{
        height: 250,
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
};

export default GasTank;
