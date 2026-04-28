
export type FrameStyle = 'plastic' | 'metal' | 'semi-rimless' | 'rimless';

export interface LensInput {
  sphere: number;
  cylinder: number;
  axis: number;
  index: number;
  pd: number;
  eyesize: number; // A
  dbl: number;
  ed: number; // Effective Diameter
  style: FrameStyle;
  vertex: number;
}

export interface CalculationResult {
  decentration: number;
  temporalEdgeThickness: number;
  nasalEdgeThickness: number;
  centerThickness: number;
  maxThickness: number;
  frameDepth: number;
  effectivePower: number;
}
