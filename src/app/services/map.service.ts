import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { MapDataModel } from '../models/map-data.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private url =
    'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson';

  constructor(private http: HttpClient) {}

  getMapData(): Observable<MapDataModel> {
    return this.http.get<MapDataModel>(this.url);
  }
}
