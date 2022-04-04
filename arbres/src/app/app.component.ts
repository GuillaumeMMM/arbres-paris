import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import arbres from '../assets/arbres.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'arbres';

  private width: number = 800;
  private height: number = 800;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };

  private data: any = [{x: 0, y: 0}];

  ngOnInit() {
    console.log(this.title);

    this.data = arbres.map(arbre => {
      return {
        x: arbre.lon,
        y: arbre.lat
      }
    })

    const x = d3.scaleLinear()
      .domain(d3.extent(this.data, (d: any) => d.x) as any).nice()
      .rangeRound([this.margin.left, this.width - this.margin.right])

    const y = d3.scaleLinear()
      .domain(d3.extent(this.data, (d: any) => d.y) as any).nice()
      .rangeRound([this.height - this.margin.bottom, this.margin.top])

    const xAxis = (g: any) => g.append("g")
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((g: any) => g.select(".domain").remove())
      .call((g: any) => g.select(".tick:last-of-type text").clone()
        .attr("y", -3)
        .attr("dy", null)
        .attr("font-weight", "bold")
        .text(this.data.x));

    const yAxis = (g: any) => g.append("g")
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call((g: any) => g.select(".domain").remove())
      .call((g: any) => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(this.data.y));


    const contours = d3.contourDensity()
      .x((d: any) => x(d.x))
      .y((d: any) => y(d.y))
      .size([this.width, this.height])
      .bandwidth(30)
      .thresholds(60)
      (this.data)

    const svg = d3.select('#chart').append('svg')
      .attr("viewBox", [0, 0, this.width, this.height]);

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    const mycolor = d3.scaleLinear()
      .domain([0, 0.01])
      .range(["white", "lightgreen"] as any);

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(contours)
      .join("path")
      .attr("stroke-width", (d, i) => i % 5 ? 0.1 : 0.3)
      .attr('fill', d => {
        return mycolor(d.value);
      })
      .attr("d", d3.geoPath());

/*     svg.append("g")
      .attr("stroke", "white")
      .attr('fill', 'pink')
      .selectAll("circle")
      .data(this.data)
      .join("circle")
      .attr("cx", (d: any) => x(d.x))
      .attr("cy", (d: any) => y(d.y))
      .attr("r", 2); */
  }
}
