import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as d3 from 'd3';
import { geoPath, GeoPath, GeoPermissibleObjects } from 'd3';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  mapData: any;
  width = 800;
  height = 600;
  url = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson';
  path: GeoPath<any, GeoPermissibleObjects> | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getMapData();
  }

  getMapData(): void {
    this.http.get<any>(this.url).subscribe((data): void => {
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
      .style('stroke-width', '1px');
  }
}
