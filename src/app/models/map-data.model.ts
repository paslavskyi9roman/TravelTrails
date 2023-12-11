import { FeatureModel } from "./feature.model";

export interface MapDataModel {
    type: string;
    features: FeatureModel[];
}