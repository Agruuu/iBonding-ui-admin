// Coordinate points
export interface Point {
  x: number
  y: number
}

// rectangle
export interface Rect {
  // top left corner X Axis coordinates
  left: number
  // top left corner Y Axis coordinates
  top: number
  // Bottom right corner X Axis coordinates
  right: number
  // Bottom right corner Y Axis coordinates
  bottom: number
  // Rectangular width
  width: number
  // Rectangular height
  height: number
}

/**
 * Determine whether two rectangles overlap
 * @param a rectangle A
 * @param b rectangle B
 */
export const isOverlap = (a: Rect, b: Rect): boolean => {
  return (
    a.left < b.left + b.width &&
    a.left + a.width > b.left &&
    a.top < b.top + b.height &&
    a.height + a.top > b.top
  )
}
/**
 * Check if the coordinate points are within the rectangle
 * @param hotArea rectangle
 * @param point coordinate
 */
export const isContains = (hotArea: Rect, point: Point): boolean => {
  return (
    point.x >= hotArea.left &&
    point.x < hotArea.right &&
    point.y >= hotArea.top &&
    point.y < hotArea.bottom
  )
}

/**
 * Between two coordinate points，Create a rectangle
 *
 * There are the following situations：
 * 1. Two coordinate points are at the same position，A square occupying only one position，Both width and height are 1
 * 2. X Same axis coordinates，A rectangle that occupies only one row，The height is 1
 * 3. Y Same axis coordinates，A rectangle that occupies only one column，Width is 1
 * 4. A rectangle with multiple rows and columns
 *
 * @param a Coordinate point one
 * @param b Coordinate point two
 */
export const createRect = (a: Point, b: Point): Rect => {
  // Calculate the range of a rectangle
  const [left, left2] = [a.x, b.x].sort()
  const [top, top2] = [a.y, b.y].sort()
  const right = left2 + 1
  const bottom = top2 + 1
  const height = bottom - top
  const width = right - left

  return { left, right, top, bottom, height, width }
}
