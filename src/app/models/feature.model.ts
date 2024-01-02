export interface FeatureModel {
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: {
    [name: string]: string;
  };
  id?: string | number;
}
