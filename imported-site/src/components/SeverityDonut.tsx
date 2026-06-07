import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { SEVERITY_ORDER, severityStyles, type Severity } from "@/lib/severity";

type SeveritySlice = { sev: Severity; value: number };

export function SeverityDonut({ counts }: { counts: Record<Severity, number> }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 220;
    const height = 220;
    const radius = Math.min(width, height) / 2;

    const data: SeveritySlice[] = SEVERITY_ORDER.map((sev) => ({ sev, value: counts[sev] || 0 }));
    const total = data.reduce((sum, d) => sum + d.value, 0);

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Unresolved issues by severity")
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    if (total === 0) {
      g.append("circle")
        .attr("r", radius - 4)
        .attr("fill", "oklch(0.95 0.01 250)");
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("class", "fill-muted-foreground")
        .attr("font-size", 12)
        .text("No data");
      return;
    }

    const pie = d3
      .pie<SeveritySlice>()
      .value((d: SeveritySlice) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<SeveritySlice>>()
      .innerRadius(radius - 40)
      .outerRadius(radius - 4)
      .padAngle(0.02)
      .cornerRadius(4);

    const tooltip = d3.select(tooltipRef.current);

    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d: d3.PieArcDatum<SeveritySlice>) => severityStyles[d.data.sev].hex)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("transition", "transform 150ms ease")
      .on("mouseenter", function (this: SVGPathElement, event: MouseEvent, d: d3.PieArcDatum<SeveritySlice>) {
        d3.select(this).attr("transform", "scale(1.04)");
        tooltip
          .style("opacity", "1")
          .html(`<strong>${d.data.sev}</strong><br/>${d.data.value} issue${d.data.value === 1 ? "" : "s"}`);
      })
      .on("mousemove", function (event: MouseEvent) {
        const [x, y] = d3.pointer(event, ref.current?.parentElement);
        tooltip.style("left", `${x + 12}px`).style("top", `${y + 12}px`);
      })
      .on("mouseleave", function (this: SVGPathElement) {
        d3.select(this).attr("transform", "scale(1)");
        tooltip.style("opacity", "0");
      });

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("class", "fill-foreground")
      .attr("font-size", 28)
      .attr("font-weight", 700)
      .text(total);
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("class", "fill-muted-foreground")
      .attr("font-size", 11)
      .text("unresolved");
  }, [counts]);

  return (
    <div className="relative" data-pa-control-id="src/components/SeverityDonut.tsx:95:5-102:11">
      <svg ref={ref} className="w-full max-w-[220px] mx-auto" />
      <div ref={tooltipRef} className="pointer-events-none absolute opacity-0 transition-opacity duration-150 rounded-md bg-foreground text-background text-xs px-2 py-1 shadow-lg" style={{ left: 0, top: 0 }} data-pa-control-id="src/components/SeverityDonut.tsx:97:7-101:9"/>
    </div>
  );
}

