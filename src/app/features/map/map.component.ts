import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private mapService: MapService = inject(MapService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getMapData();
  }

  getMapData(): void {
    this.mapService
      .getMapData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: MapDataModel): void => {
        this.processData(data);
        this.route.queryParams.subscribe((params: Params): void => {
          const sharedCountries = params['selectedCountries'];

          if (sharedCountries) {
            const featureIds = sharedCountries.split(',');
            this.selectedFeatures = new Set(
              this.mapData.features.filter((feature: FeatureModel) =>
                featureIds.includes(feature.properties.name),
              ),
            );

            this.highlightSelectedFeatures();
          }
        });
      });
  }

  processData(data: MapDataModel): void {
    this.mapData = data;
    const svg = d3.select('#mapSvg');
    const projection: d3.GeoProjection = d3
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
      .on('mouseenter', (event: any, d: any): void => {
        this.handleMouseEnter(event, d);
      })
      .on('mouseleave', (event: any, d: any): void => {
        this.handleMouseLeave(event, d);
      })
      .on('click', (event: any, d: any): void => {
        this.handleClick(event, d);
      });
  }

  getFeatureFillColor(feature: FeatureModel): string {
    return this.selectedFeatures.has(feature) ? 'purple' : 'steelblue';
  }

  handleMouseEnter(event: any, feature: FeatureModel): void {
    const { clientX: x, clientY: y, target } = event;
    this.currentHoveredFeature = feature;
    this.highlightFeature(target);
    this.eventPos.set({ x, y });
    this.cd.detectChanges();
    this.showmodal.set(true);
  }

  highlightFeature(target: SVGPathElement): void {
    d3.select(target).style('fill', 'orange');
  }

  highlightSelectedFeatures(): void {
    const svg = d3.select('#mapSvg');
    svg
      .selectAll('path')
      .filter((d: any) => this.selectedFeatures.has(d))
      .style('fill', 'purple');
  }

  setFeatureFillColor(event: any, feature: FeatureModel): void {
    const fillColor: string = this.getFeatureFillColor(feature);
    d3.select(event.target).style('fill', fillColor);
  }

  handleMouseLeave(event: any, feature: FeatureModel): void {
    if (!this.selectedFeatures.has(feature)) {
      this.currentHoveredFeature = null;
    }
    this.setFeatureFillColor(event, feature);
    this.showmodal.set(false);
  }

  handleClick(event: any, feature: FeatureModel): void {
    if (this.selectedFeatures.has(feature)) {
      this.selectedFeatures.delete(feature);
    } else {
      this.selectedFeatures.add(feature);
    }
    this.setFeatureFillColor(event, feature);
    this.cd.detectChanges();
  }

  isHovered(feature: FeatureModel): boolean {
    return (
      feature === this.currentHoveredFeature &&
      !this.selectedFeatures.has(feature)
    );
  }

  resetMap(): void {
    this.selectedFeatures = new Set();
    this.mapService.getMapData().subscribe((data: MapDataModel): void => {
      this.processData(data);
      const svg = d3.select('#mapSvg');
      svg.selectAll('path').style('fill', 'steelblue');
    });
  }
}
