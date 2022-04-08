import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import arbres from '../../../assets/arbres.json';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor() { }

  private data: any = [{ x: 0, y: 0 }];
  private width: number = 800;
  private height: number = 800;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };

  ngOnInit(): void {

    const path = d3.geoPath();

    const projection = d3.geoConicConformal()
      .center([2.349014, 48.864716])
      .scale(200600)
      .translate([this.width / 2, this.height / 2]);

    path.projection(projection);

    const svg = d3.select('#map').append("svg")
      .attr("id", "svg")
      .attr("width", this.width)
      .attr("height", this.height);


    d3.json('../../../assets/les-arbres-plantes.geojson').then((geojsonArbres: any) => {
      d3.json('../../../assets/arrondissements.geojson').then((geojson: any) => {
        const deps = svg.append("g");
        deps.selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr('stroke', 'pink')
          .attr('stroke-width', 3)
          .attr('fill', 'none')
          .attr("d", path as any);


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


        const contours = d3.contourDensity()
          .x((d: any) => x(d.x))
          .y((d: any) => y(d.y))
          .size([this.width, this.height])
          .bandwidth(30)
          .thresholds(60)
          (this.data)

        const mycolor = d3.scaleLinear()
          .domain([0, 0.01])
          .range(["white", "lightgreen"] as any);

        const arbresTmp = svg.append("g");
        arbresTmp.selectAll("path")
          .data(geojsonArbres.features)
          .enter()
          .append("path")
          .attr('stroke', 'black')
          .attr('fill', 'none')
          .attr("d", path as any);

        /*  svg.append("g")
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
     .attr("d", d3.geoPath()); */
      });
    });
  }

}
