export type LensType = 'Daily' | 'Two-Week' | 'Monthly' | 'RGP';

export interface Lens {
  id: string;
  brand: string;
  name: string;
  type: LensType;
  description: string;
  price?: number;
  features: string[];
  manufacturer: string;
  imageUrl?: string;
  popularity: number; // 0-100
  specs?: {
    material: string;
    waterContent: string;
    diameter: string;
    baseCurve: string;
  };
}
