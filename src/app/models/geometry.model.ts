export interface GeometryModel {
  type: string;
  coordinates: CoordinatesModel[];
}

type CoordinatesModel = [number, number];
