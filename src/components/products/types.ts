export interface ProductData {
  id: string;
  slug: string;
  name: string;
  featured?: boolean;
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
  translations?: Record<string, any>;
}

export interface ProductSpecs {
  weight?: {
    value: number; // in Kilograms
    customizable: boolean;
  };
  volume?: {
    value: number; // in Liters
    customizable: boolean;
  };
  material?: {
    value: string;
    customizable: boolean;
  };
  dimension?: Dimensions;
  electrical?: ElectricalSpecs;
  operating_temperature?: TemperatureRange;
  process_technology?: {
    value: string[];
    customizable: boolean;
  };
}

export interface Dimensions {
  external?: DimensionMeasurements;
  internal?: DimensionMeasurements;
  customizable: boolean;
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
  customizable: boolean;
}

interface Range {
  min: number;
  max: number;
}

export interface TemperatureRange extends Range {
  customizable: boolean;
}

export interface EngineeringDrawings {
  ortho_projections: string[];
  models: string[];
}

export interface Policies {
  warranty: string;
  return?: string;
  shipping: string;
}
