/**
 * @module lib/spline
 *
 * Catmull-Rom spline sampling. Given four control points and a
 * parameter t in [0, 1], returns the point along the spline between
 * the middle two control points.
 *
 * Catmull-Rom splines pass *through* their control points, which
 * makes them ideal for camera paths: the curve goes through the
 * start and end, with two "outside" control points shaping the arc.
 *
 * The formula for each axis (x, y, z) is:
 *
 *   P(t) = 0.5 * (
 *     (2 * P1) +
 *     (-P0 + P2) * t +
 *     (2 * P0 - 5 * P1 + 4 * P2 - P3) * t^2 +
 *     (-P0 + 3 * P1 - 3 * P2 + P3) * t^3
 *   )
 *
 * Where P0, P1, P2, P3 are the four control points.
 */

import { Vector3 } from 'three';

/**
 * Samples a Catmull-Rom spline between P1 and P2 at parameter t.
 *
 * @param p0 - Control point before the segment
 * @param p1 - Segment start point
 * @param p2 - Segment end point
 * @param p3 - Control point after the segment
 * @param t - Parameter in [0, 1]. 0 returns p1, 1 returns p2.
 * @returns The interpolated point along the spline.
 */
export function catmullRom(
  p0: Vector3,
  p1: Vector3,
  p2: Vector3,
  p3: Vector3,
  t: number,
): Vector3 {
  const t2 = t * t;
  const t3 = t2 * t;

  const result = new Vector3();

  // Apply the Catmull-Rom formula to each axis.
  result.x = catmullRomAxis(p0.x, p1.x, p2.x, p3.x, t, t2, t3);
  result.y = catmullRomAxis(p0.y, p1.y, p2.y, p3.y, t, t2, t3);
  result.z = catmullRomAxis(p0.z, p1.z, p2.z, p3.z, t, t2, t3);

  return result;
}

/**
 * Single-axis Catmull-Rom evaluation.
 * Factored out for clarity and to avoid recomputing t2/t3 three times.
 */
function catmullRomAxis(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number,
  t2: number,
  t3: number,
): number {
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

/**
 * Computes a control point that pushes a curve outward from the
 * straight-line path between two endpoints.
 *
 * The control point is placed at the midpoint between start and end,
 * offset outward by a perpendicular vector scaled by `offsetFactor`.
 *
 * @param start - Start of the path
 * @param end - End of the path
 * @param offsetFactor - How much to push outward (0 = no offset)
 * @returns A control point for use in a Catmull-Rom spline
 */
export function computeArcControlPoint(
  start: Vector3,
  end: Vector3,
  offsetFactor: number,
): Vector3 {
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Direction from start to end.
  const direction = new Vector3().subVectors(end, start);
  const length = direction.length();

  if (length < 0.001) {
    // Degenerate case: start and end are the same point.
    return midpoint;
  }

  direction.normalize();

  // Perpendicular vector: cross with world up (0, 1, 0).
  const up = new Vector3(0, 1, 0);
  const perpendicular = new Vector3().crossVectors(direction, up);

  // If the direction is parallel to up, the cross product is zero.
  // Fall back to a horizontal perpendicular.
  if (perpendicular.length() < 0.001) {
    perpendicular.set(1, 0, 0);
  } else {
    perpendicular.normalize();
  }

  // Offset the midpoint outward along the perpendicular.
  const offset = length * offsetFactor;
  return midpoint.addScaledVector(perpendicular, offset);
}
