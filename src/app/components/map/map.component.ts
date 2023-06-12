import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import { geoPath, GeoPath, GeoPermissibleObjects } from 'd3';

import {MapService} from "../../services/map.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  mapData: any;
  width = 800;
  height = 600;
  path: GeoPath<any, GeoPermissibleObjects> | null = null;
  currentHoveredFeature: any;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.getMapData();
  }

  getMapData(): void {
    this.mapService.getMapData().subscribe((data: any) => {
      this.processData(data);
    });
  }

  processData(data: any): void {
    this.mapData = data;
    const svg = d3.select('#mapSvg');

    const projection = d3.geoMercator().fitSize([this.width, this.height], this.mapData);

    this.path = geoPath().projection(projection);

    svg.selectAll('path')
      .data(this.mapData.features)
      .enter()
      .append('path')
      .attr('d', (d: any) => this.path!(d) as string)
      .style('fill', 'steelblue')
      .style('stroke', 'white')
      .style('stroke-width', '1px')
      .on('mouseenter', (event: any, d: any) => {
        this.currentHoveredFeature = d;
        d3.select(event.target).style('fill', 'orange');
      })
      .on('mouseleave', (event: any, d: any) => {
        this.currentHoveredFeature = null;
        d3.select(event.target).style('fill', 'steelblue');
      });
  }
}
