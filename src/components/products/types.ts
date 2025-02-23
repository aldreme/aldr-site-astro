export interface ProductData {
  name: string;
  category: string;
  tags: string[];
  price: number;
  images: string[];
  description: string;
  introduction: string;
  features: string[];
  specs: ProductSpecs;
  technology: string;
  application_scenarios: string[];
  customization: string;
  engineering_drawings: EngineeringDrawings;
  policies: Policies;
}

interface ProductSpecs {
  weight: number;
  volume: number;
  material: string;
  dimension: Dimensions;
  electrical: Electrical;
  operating_temperature: TemperatureRange;
}

interface Dimensions {
  external: DimensionMeasurements;
  internal: DimensionMeasurements;
}

interface DimensionMeasurements {
  width: number;
  height: number;
  length: number;
}

interface Electrical {
  voltage: Range;
  current: Range;
  power: Range;
}

interface Range {
  min: number;
  max: number;
}

interface TemperatureRange extends Range { }

interface EngineeringDrawings {
  "2d": string[];
  "3d": string[];
}

interface Policies {
  warranty: string;
  return: string;
  shipping: string;
}