export interface ProductData {
  name: string;
  category: string;
  tag: string;
  price: number;
  images: string[];
  description: string;
  specs: {
    dimension: {
      width: number;
      height: number;
      length: number;
    };
    weight: number;
    material: string;
    technology: string;
  };
}