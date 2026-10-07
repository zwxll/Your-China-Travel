export interface VegetationSeeds {
  grass: number
  wildflowers: number
}

/** Keeps vegetation deterministic while separating its random sequences. */
export function vegetationSeeds(seed: number): VegetationSeeds {
  return {
    grass: seed,
    wildflowers: (seed ^ 0x9e3779b9) >>> 0,
  }
}
