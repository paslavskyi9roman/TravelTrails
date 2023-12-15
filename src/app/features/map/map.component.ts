import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
} from '@angular/core';

import * as d3 from 'd3';
import { geoPath, GeoPath, GeoPermissibleObjects } from 'd3';

import { FeatureModel } from 'src/app/models/feature.model';
import { MapDataModel } from 'src/app/models/map-data.model';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  mapData: any;
  width = 1800;
  height = 1200;
  path: GeoPath<any, GeoPermissibleObjects> | null = null;
  currentHoveredFeature: FeatureModel | null;
  selectedFeatures: Set<FeatureModel> = new Set();
  showmodal = signal(false);
  eventPos = signal({ x: 0, y: 0 });
  private previousHoveredFeature: FeatureModel;

  constructor(private mapService: MapService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getMapData();
  }

  getMapData(): void {
    this.mapService.getMapData().subscribe((data: MapDataModel): void => {
      this.processData(data);
    });
  }

  processData(data: any): void {
    this.mapData = data;
    const svg = d3.select('#mapSvg');
    const projection = d3
      .geoMercator()
      .fitSize([this.width, this.height], this.mapData);
    this.path = geoPath().projection(projection);

    svg
      .selectAll('path')
      .data(this.mapData.features)
      .enter()
      .append('path')
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
        this.handleClick(event, d);
      });
  }

  getFeatureFillColor(feature: FeatureModel): string {
    return this.selectedFeatures.has(feature) ? 'purple' : 'steelblue';
  }

  handleMouseEnter(event: any, feature: FeatureModel): void {
    if (this.previousHoveredFeature !== feature) {
      this.currentHoveredFeature = feature;
      this.previousHoveredFeature = feature;
    }
    this.currentHoveredFeature = feature;
    d3.select(event.target).style('fill', 'orange');
    this.eventPos.set({
      x: event.clientX,
      y: event.clientY,
    });
    this.cd.detectChanges();
    this.showmodal.set(true);
  }

  handleMouseLeave(event: any, feature: FeatureModel): void {
    if (!this.selectedFeatures.has(feature)) {
      this.currentHoveredFeature = null;
    }
    const fillColor = this.getFeatureFillColor(feature);
    d3.select(event.target).style('fill', fillColor);
    this.showmodal.set(false);
  }

  handleClick(event: any, feature: FeatureModel): void {
    if (this.selectedFeatures.has(feature)) {
      this.selectedFeatures.delete(feature);
    } else {
      this.selectedFeatures.add(feature);
    }
    const fillColor = this.getFeatureFillColor(feature);
    d3.select(event.target).style('fill', fillColor);
  }

  isHovered(feature: FeatureModel): boolean {
    return feature === this.currentHoveredFeature && !this.selectedFeatures.has(feature);
  }
}
