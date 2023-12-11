import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import * as d3 from 'd3';
import { geoPath, GeoPath, GeoPermissibleObjects } from 'd3';

import { MapService } from "../../services/map.service";
import { MapDataModel } from 'src/app/models/map-data.model';
import { FeatureModel } from 'src/app/models/feature.model';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {
  mapData: any;
  width = 1800;
  height = 1200;
  path: GeoPath<any, GeoPermissibleObjects> | null = null;
  currentHoveredFeature: FeatureModel | null;
  selectedFeatures: Set<FeatureModel> = new Set();

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.mapService.getMapData().subscribe((data: MapDataModel): void => {
      this.processData(data);
    });
  }

  processData(data: MapDataModel): void {
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
      .on('mouseenter', (event: any, d: any): void => {
        this.handleMouseEnter(event, d);
      })
      .on('mouseleave', (event: any, d: any): void => {
        this.handleMouseLeave(event, d);
      })
      .on('click', (event: any, d: any): void => {
        this.handleClick(d, event);
      });
  }

  getFeatureFillColor(feature: FeatureModel): string {
    return this.selectedFeatures.has(feature) ? 'purple' : 'steelblue';
  }

  handleMouseEnter(event: MouseEvent, feature: FeatureModel): void {

    this.currentHoveredFeature = feature;
    d3.select(event.target as d3.BaseType).style('fill', 'orange');
  }

  handleMouseLeave(event: MouseEvent, feature: FeatureModel): void {

    if (!this.selectedFeatures.has(feature)) {
      this.currentHoveredFeature = null;
    }
    this.updateFillColor(event.target as d3.BaseType, feature);
  }

  handleClick(event: MouseEvent, feature?: FeatureModel): void {

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

  updateFillColor(event: any, feature: any): void {
    const fillColor = this.getFeatureFillColor(feature);
    d3.select(event).style('fill', fillColor);
  }
}
