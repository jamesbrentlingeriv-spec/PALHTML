import type { LensInput, CalculationResult } from "../types";

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
  const { sphere, cylinder, pd, eyesize, dbl, ed, index, style, vertex } =
    input;

  // Calculate effective power
  const effectivePower = sphere / (1 - (vertex / 1000) * sphere);

  // Calculate decentration
  const gcd = eyesize + dbl;
  const decentration = Math.abs((gcd - pd) / 2);

  // Maximum power for thickness estimation
  const power1 = sphere;
  const power2 = sphere + cylinder;
  const maxPower = Math.max(Math.abs(power1), Math.abs(power2));
  const isMinus = sphere + cylinder / 2 < 0;

  if (isMinus) {
    // Minus lenses: center thin, edges thick
    const centerThickness = index >= 1.6 ? 1.5 : 2.0;

    const temporalRadius = eyesize / 2 + decentration;
    const nasalRadius = Math.max(0, eyesize / 2 - decentration);

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
    // Plus lenses: center thick, edges thin
    const edgeThickness = 1.0;

    const furthestRadius = ed / 2 + decentration;
    const centerSag = calculateSag(furthestRadius, maxPower, index);

    const centerThickness = edgeThickness + centerSag;

    const temporalRadius = eyesize / 2 + decentration;
    const nasalRadius = Math.max(0, eyesize / 2 - decentration);

    const temporalEdgeThickness = Math.max(
      edgeThickness,
      centerThickness - calculateSag(temporalRadius, maxPower, index),
    );
    const nasalEdgeThickness = Math.max(
      edgeThickness,
      centerThickness - calculateSag(nasalRadius, maxPower, index),
    );

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
    case "plastic":
      return 5.0;
    case "metal":
      return 2.5;
    case "semi-rimless":
      return 2.5;
    case "rimless":
      return 1.0;
    default:
      return 3.0;
  }
}
