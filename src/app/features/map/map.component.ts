import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import * as d3 from 'd3';
import { geoPath, GeoPath } from 'd3';

import { FeatureModel } from 'src/app/models/feature.model';
import { MapDataModel } from 'src/app/models/map-data.model';
import { MapService } from 'src/app/services/map.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  mapData: MapDataModel;
  width = 1800;
  height = 1200;
  path: GeoPath | null = null;
  currentHoveredFeature: FeatureModel | null;
  selectedFeatures: Set<FeatureModel> = new Set();
  showModal = signal(false);
  eventPos = signal({ x: 0, y: 0 });
  private mapService: MapService = inject(MapService);
  private localStorageService: LocalStorageService = inject(LocalStorageService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
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
          const featureIds = sharedCountries.split(',');

          if (sharedCountries) {
            this.selectedFeatures = new Set(
              this.mapData.features.filter((feature: FeatureModel) => featureIds.includes(feature.properties['name']))
            );
          }
          this.localStorageService.saveData('selectedCountries', this.selectedFeatures);
          this.router.navigate([]).then();
          this.highlightSelectedFeatures();
          this.cd.detectChanges();
        });
      });
  }

  processData(data: MapDataModel): void {
    this.mapData = data;
    const svg = d3.select('#mapSvg');
    const projection: d3.GeoProjection = d3.geoMercator().fitSize([this.width, this.height], this.mapData);
    this.path = geoPath().projection(projection);

    svg
      .selectAll('path')
      .data(this.mapData.features)
      .enter()
      .append('path')
      .attr('d', (d: FeatureModel) => this.path!(d) as string)
      .style('fill', (d: FeatureModel) => this.getFeatureFillColor(d))
      .style('stroke', 'white')
      .style('stroke-width', '1px')
      .on('mouseenter', (event: MouseEvent, d: FeatureModel): void => {
        this.handleMouseEnter(event, d as FeatureModel);
      })
      .on('mouseleave', (event: MouseEvent, d: FeatureModel): void => {
        this.handleMouseLeave(event, d);
      })
      .on('click', (event: MouseEvent, d: FeatureModel): void => {
        this.handleClick(event, d);
      });
  }

  getFeatureFillColor(feature: FeatureModel): string {
    return this.selectedFeatures.has(feature) ? 'green' : 'steelblue';
  }

  handleMouseEnter(event: MouseEvent, feature: FeatureModel): void {
    const { clientX: x, clientY: y, target } = event;

    if (target instanceof SVGPathElement) {
      this.currentHoveredFeature = feature;
      this.highlightFeature(target);
      this.eventPos.set({ x, y });
      this.cd.detectChanges();
      this.showModal.set(true);
    }
  }

  highlightFeature(target: SVGPathElement): void {
    d3.select(target).style('fill', 'orange');
  }

  highlightSelectedFeatures(): void {
    const svg = d3.select('#mapSvg');
    svg
      .selectAll('path')
      .filter(d => this.selectedFeatures.has(d as FeatureModel))
      .style('fill', 'green');
  }

  setFeatureFillColor(event: MouseEvent, feature: FeatureModel): void {
    const fillColor: string = this.getFeatureFillColor(feature);

    if (event.target) {
      d3.select(event.target as d3.BaseType).style('fill', fillColor);
    }
  }

  handleMouseLeave(event: MouseEvent, feature: FeatureModel): void {
    if (!this.selectedFeatures.has(feature)) {
      this.currentHoveredFeature = null;
    }
    this.setFeatureFillColor(event, feature);
    this.showModal.set(false);
  }

  handleClick(event: MouseEvent, feature: FeatureModel): void {
    if (this.selectedFeatures.has(feature)) {
      this.selectedFeatures.delete(feature);
    } else {
      this.selectedFeatures.add(feature);
    }
    this.setFeatureFillColor(event, feature);
    this.localStorageService.saveData('selectedCountries', this.selectedFeatures);
    this.cd.detectChanges();
  }

  isHovered(feature: FeatureModel): boolean {
    return feature === this.currentHoveredFeature && !this.selectedFeatures.has(feature);
  }

  resetMap(): void {
    this.selectedFeatures = new Set();
    this.localStorageService.clearData();
    const svg = d3.select('#mapSvg');
    svg.selectAll('path').style('fill', 'steelblue');
  }
}
