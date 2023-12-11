import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import { geoPath, GeoPath, GeoPermissibleObjects } from 'd3';

import { MapService } from "../../services/map.service";

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
  selectedFeatures: Set<any> = new Set();

  constructor(private mapService: MapService) { }

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
      .join('path')
      .attr('d', (d: any) => this.path!(d) as string)
      .style('fill', (d: any) => this.getFeatureFillColor(d))
      .style('stroke', 'white')
      .style('stroke-width', '1px')
      .on('mouseenter', (event: any, d: any) => {
        this.handleMouseEnter(event, d);
      })
      .on('mouseleave', (event: any, d: any) => {
        this.handleMouseLeave(event, d);
      })
      .on('click', (event: any, d: any) => {
        this.handleClick(d, event);
      });
  }

  getFeatureFillColor(feature: any): string {
    return this.selectedFeatures.has(feature) ? 'purple' : 'steelblue';
  }

  handleMouseEnter(event: any, feature: any): void {
    this.currentHoveredFeature = feature;
    d3.select(event.target).style('fill', 'orange');
  }

  handleMouseLeave(event: any, feature: any): void {
    if (!this.selectedFeatures.has(feature)) {
      this.currentHoveredFeature = null;
    }
    this.updateFillColor(event.target, feature);
  }

  handleClick(event: any, feature?: any): void {
    this.toggleClickedFeature(feature);
    this.updateFillColor(event.target, feature);
  }

  toggleClickedFeature(feature: any): void {
    if (this.selectedFeatures.has(feature)) {
      this.selectedFeatures.delete(feature);
    } else {
      this.selectedFeatures.add(feature);
    }
  }

  updateFillColor(element: any, feature: any): void {
    const fillColor = this.getFeatureFillColor(feature);
    d3.select(element).style('fill', fillColor);
  }
}
