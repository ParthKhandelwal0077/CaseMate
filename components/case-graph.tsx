"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export function CaseGraph() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove()

    // Sample data
    const nodes = [
      { id: "complaint", label: "Complaint", status: "completed" },
      { id: "response", label: "Response", status: "completed" },
      { id: "evidence", label: "Evidence", status: "completed" },
      { id: "hearing", label: "Hearing", status: "pending" },
      { id: "judgment", label: "Judgment", status: "pending" },
    ]

    const links = [
      { source: "complaint", target: "response" },
      { source: "response", target: "evidence" },
      { source: "evidence", target: "hearing" },
      { source: "hearing", target: "judgment" },
    ]

    // Set up SVG
    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = 200

    // Create a force simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(80),
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))

    // Create links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)

    // Create nodes
    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended) as any)

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 25)
      .attr("fill", (d: any) => (d.status === "completed" ? "#3b82f6" : "#94a3b8"))

    // Add text to nodes
    node
      .append("text")
      .text((d: any) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "white")
      .attr("font-size", "10px")

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }
  }, [])

  return (
    <div className="w-full h-[200px]">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  )
}
