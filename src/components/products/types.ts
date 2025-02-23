export interface ProductData {
  name: string;
  category: string;
  tags: string[];
  price: number;
  images: string[];
  description: string;
  introduction?: string;
  features: string[];
  specs: ProductSpecs;
  application_scenarios: string[];
  customization?: string;
  engineering_drawings: EngineeringDrawings;
  policies: Policies;
}

export interface ProductSpecs {
  weight: number; // in Kilograms
  volume?: number; // in Liters
  material: string;
  dimension: Dimensions;
  electrical?: ElectricalSpecs;
  operating_temperature?: TemperatureRange;
  process_technology: string[];
}

export interface Dimensions {
  external?: DimensionMeasurements;
  internal?: DimensionMeasurements;
}

export interface DimensionMeasurements {
  width: number; // in centimeters
  height: number; // in centimeters
  length: number; // in centimeters
}

export interface ElectricalSpecs {
  voltage: Range; // in Volts
  current: Range; // in Amperes
  power: Range; // in Watts
}

interface Range {
  min: number;
  max: number;
}

export interface TemperatureRange extends Range { }

export interface EngineeringDrawings {
  ortho_projections: string[];
  models: string[];
}

export interface Policies {
  warranty: string;
  return: string;
  shipping: string;
}