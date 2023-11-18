export const clamp = (x: number, min: number, max: number) => {
  return Math.min(Math.max(x, min), max)
}

export interface BooleanDirection {
  left: boolean
  right: boolean
  forward: boolean
  back: boolean
}
