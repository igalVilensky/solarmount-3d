import type { Vector3 } from './types'

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function normalizeVector(vector: Vector3): Vector3 {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)

  if (length === 0) {
    return { x: 0, y: 0, z: 0 }
  }

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  }
}

export function dotProduct(left: Vector3, right: Vector3): number {
  return left.x * right.x + left.y * right.y + left.z * right.z
}

/**
 * Coordinate system:
 * x = east, y = up, z = south.
 * Panel azimuth is the direction the panel faces.
 */
export function getPanelNormal(tiltDegrees: number, azimuthDegrees: number): Vector3 {
  const tilt = degreesToRadians(tiltDegrees)
  const azimuth = degreesToRadians(azimuthDegrees)
  const horizontalMagnitude = Math.sin(tilt)

  return normalizeVector({
    x: horizontalMagnitude * Math.sin(azimuth),
    y: Math.cos(tilt),
    z: -horizontalMagnitude * Math.cos(azimuth),
  })
}

/**
 * Convert a sun azimuth/elevation pair into a unit direction vector.
 * The vector points from the origin toward the sun.
 */
export function getSunDirection(azimuthDegrees: number, elevationDegrees: number): Vector3 {
  const azimuth = degreesToRadians(azimuthDegrees)
  const elevation = degreesToRadians(elevationDegrees)
  const horizontalMagnitude = Math.cos(elevation)

  return normalizeVector({
    x: horizontalMagnitude * Math.sin(azimuth),
    y: Math.sin(elevation),
    z: -horizontalMagnitude * Math.cos(azimuth),
  })
}

export function getPanelSunAlignment(tiltDegrees: number, panelAzimuthDegrees: number, sunAzimuthDegrees: number, sunElevationDegrees: number): number {
  const panelNormal = getPanelNormal(tiltDegrees, panelAzimuthDegrees)
  const sunDirection = getSunDirection(sunAzimuthDegrees, sunElevationDegrees)

  return clamp(Math.max(0, dotProduct(panelNormal, sunDirection)), 0, 1)
}

