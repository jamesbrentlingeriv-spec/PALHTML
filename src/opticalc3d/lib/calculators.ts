
import type { LensInput, CalculationResult } from '../types';

/**
 * Calculates the exact sagitta of a lens at a given radius.
 * Surface power F = (n - 1) / R => R = (n - 1) / F
 * s = R - sqrt(R^2 - h^2)
 * @param h distance from optical center in mm
 * @param f power in diopters
 * @param n refractive index
 */
export function calculateSag(h: number, f: number, n: number): number {
  if (f === 0) return 0;
  // Radius of curvature in mm (F is in m^-1, so multiply by 1000)
  const R = (1000 * (n - 1)) / Math.abs(f);
  
  // Exact sag formula
  // Handle case where h > R (though shouldn't happen for valid lens geometry)
  if (h >= R) return R; 
  
  return R - Math.sqrt(R * R - h * h);
}

export function calculateLensThickness(input: LensInput): CalculationResult {
  const { sphere, cylinder, pd, eyesize, dbl, ed, index, style, vertex } = input;

  // 1. Calculate Effective Power at Vertex Distance (simplified to sphere equivalent)
  // Fe = F / (1 - d*F) where d is change in distance in meters
  // We'll calculate the compensated power used by the eye
  const powerS = sphere;
  const powerC = sphere + cylinder;
  const effectivePower = sphere / (1 - (vertex / 1000) * sphere);

  // 2. Calculate Decentration (Per Eye)
  // Geometric Center Distance (GCD) = eyesize + dbl
  const gcd = eyesize + dbl;
  const decentration = Math.abs((gcd - pd) / 2);

  // 2. Identify maximum power (for thickness estimation)
  // We'll simplify and use the maximum absolute power for the visualization
  // In reality, it varies by axis, but for edge thickness we often look at the steepest meridian.
  const power1 = sphere;
  const power2 = sphere + cylinder;
  const maxPower = Math.max(Math.abs(power1), Math.abs(power2));
  const isMinus = (sphere + cylinder / 2) < 0; // Simple check for plus/minus dominant

  // 3. Set Base thicknesses
  // Industry standards for minimum thickness for safety
  let centerThickness = 2.0; 
  let edgeThickness = 2.0;

  if (isMinus) {
    // Minus lenses are thinnest at center
    centerThickness = index >= 1.6 ? 1.5 : 2.0; 
    
    // We calculate "radius" for temporal and nasal edges relative to optical center
    // Distance from optical center to temporal edge = (eyesize/2) + decentration
    const temporalRadius = (eyesize / 2) + decentration;
    // Distance from optical center to nasal edge = (eyesize/2) - decentration
    const nasalRadius = Math.max(0, (eyesize / 2) - decentration);
    
    const temporalSag = calculateSag(temporalRadius, maxPower, index);
    const nasalSag = calculateSag(nasalRadius, maxPower, index);

    const temporalEdgeThickness = centerThickness + temporalSag;
    const nasalEdgeThickness = centerThickness + nasalSag;
    const maxThickness = Math.max(temporalEdgeThickness, nasalEdgeThickness);

    return {
      decentration,
      centerThickness,
      temporalEdgeThickness,
      nasalEdgeThickness,
      maxThickness,
      frameDepth: getFrameDepth(style),
      effectivePower,
    };
  } else {
    // Plus lenses are thinnest at edge
    edgeThickness = 1.0; 
    
    // For plus lenses, we need to find what center thickness results in the min edge thickness
    // at the FURTHEST point from the optical center.
    const furthestRadius = (ed / 2) + decentration; 
    const centerSag = calculateSag(furthestRadius, maxPower, index);
    
    centerThickness = edgeThickness + centerSag;

    // Radius at edges for display
    const temporalRadius = (eyesize / 2) + decentration;
    const nasalRadius = Math.max(0, (eyesize / 2) - decentration);
    
    const temporalEdgeThickness = Math.max(edgeThickness, centerThickness - calculateSag(temporalRadius, maxPower, index));
    const nasalEdgeThickness = Math.max(edgeThickness, centerThickness - calculateSag(nasalRadius, maxPower, index));

    return {
      decentration,
      centerThickness,
      temporalEdgeThickness,
      nasalEdgeThickness,
      maxThickness: centerThickness,
      frameDepth: getFrameDepth(style),
      effectivePower,
    };
  }
}

function getFrameDepth(style: string): number {
  switch (style) {
    case 'plastic': return 5.0;
    case 'metal': return 2.5;
    case 'semi-rimless': return 2.5;
    case 'rimless': return 1.0;
    default: return 3.0;
  }
}
