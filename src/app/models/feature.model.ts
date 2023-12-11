import { GeometryModel } from "./geometry.model";
import { PropertiesModel } from "./properties.model";

export interface FeatureModel {
    type: string;
    geometry: GeometryModel;
    properties: PropertiesModel;
}