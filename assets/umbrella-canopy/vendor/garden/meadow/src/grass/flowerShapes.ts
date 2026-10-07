import * as THREE from 'three'

const MASK_TILE_WIDTH = 160
const MASK_HEIGHT = 256
export const MASK_VARIANTS = 3

export type FlowerPalette = {
  petal: THREE.Color
  foliage: THREE.Color
  centre: THREE.Color
}

export const FLOWER_PALETTES: readonly FlowerPalette[] = [
  {
    petal: new THREE.Color('#e9a5be'),
    foliage: new THREE.Color('#467628'),
    centre: new THREE.Color('#f3c463'),
  },
  {
    petal: new THREE.Color('#9e8bd7'),
    foliage: new THREE.Color('#3f7043'),
    centre: new THREE.Color('#f0d178'),
  },
  {
    petal: new THREE.Color('#e9b665'),
    foliage: new THREE.Color('#58782c'),
    centre: new THREE.Color('#bf6950'),
  },
  {
    petal: new THREE.Color('#9aa9df'),
    foliage: new THREE.Color('#466b50'),
    centre: new THREE.Color('#f3c7a2'),
  },
]

export function createMaskTexture(): THREE.Texture {
  if (typeof document === 'undefined') {
    const texture = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1)
    texture.needsUpdate = true
    return texture
  }

  const canvas = document.createElement('canvas')
  canvas.width = MASK_TILE_WIDTH * MASK_VARIANTS
  canvas.height = MASK_HEIGHT
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to create the procedural wildflower canvas.')

  context.clearRect(0, 0, canvas.width, canvas.height)
  drawDaisy(context, 0)
  drawFlowerSpike(context, MASK_TILE_WIDTH)
  drawBranchingFlowers(context, MASK_TILE_WIDTH * 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  return texture
}

function setMaskColor(
  context: CanvasRenderingContext2D,
  channel: 'petal' | 'foliage' | 'centre',
): void {
  context.fillStyle =
    channel === 'petal' ? '#ff0000' : channel === 'foliage' ? '#00ff00' : '#0000ff'
  context.strokeStyle = context.fillStyle
}

function drawStem(
  context: CanvasRenderingContext2D,
  points: readonly [number, number][],
  width: number,
): void {
  setMaskColor(context, 'foliage')
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.lineWidth = width
  context.beginPath()
  context.moveTo(points[0][0], points[0][1])
  for (let index = 1; index < points.length; index += 1)
    context.lineTo(points[index][0], points[index][1])
  context.stroke()
}

function drawLeaf(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
): void {
  setMaskColor(context, 'foliage')
  context.save()
  context.translate(x, y)
  context.rotate(angle)
  context.beginPath()
  context.moveTo(0, 0)
  context.quadraticCurveTo(length * 0.35, -length * 0.18, length, 0)
  context.quadraticCurveTo(length * 0.35, length * 0.18, 0, 0)
  context.fill()
  context.restore()
}

function drawPetals(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  petals: number,
): void {
  setMaskColor(context, 'petal')
  for (let index = 0; index < petals; index += 1) {
    context.save()
    context.translate(x, y)
    context.rotate((index / petals) * Math.PI * 2)
    context.beginPath()
    context.ellipse(0, -radius * 0.62, radius * 0.28, radius * 0.58, 0, 0, Math.PI * 2)
    context.fill()
    context.restore()
  }
  setMaskColor(context, 'centre')
  context.beginPath()
  context.arc(x, y, radius * 0.26, 0, Math.PI * 2)
  context.fill()
}

function drawDaisy(context: CanvasRenderingContext2D, x: number): void {
  const stemX = x + 81
  drawStem(
    context,
    [
      [stemX, 248],
      [stemX - 3, 170],
      [stemX + 3, 101],
    ],
    7,
  )
  drawLeaf(context, stemX - 2, 185, Math.PI * 0.78, 52)
  drawLeaf(context, stemX + 1, 151, -Math.PI * 0.66, 45)
  drawPetals(context, stemX + 3, 72, 45, 9)
}

function drawFlowerSpike(context: CanvasRenderingContext2D, x: number): void {
  const stemX = x + 79
  drawStem(
    context,
    [
      [stemX, 249],
      [stemX - 2, 172],
      [stemX + 5, 58],
    ],
    7,
  )
  drawLeaf(context, stemX - 2, 184, Math.PI * 0.84, 51)
  drawLeaf(context, stemX + 1, 154, -Math.PI * 0.75, 38)
  setMaskColor(context, 'petal')
  for (let index = 0; index < 9; index += 1) {
    const y = 118 - index * 9
    const width = 22 - index * 1.2
    context.beginPath()
    context.ellipse(
      stemX + (index % 2 === 0 ? -6 : 6),
      y,
      width * 0.52,
      8,
      index % 2 === 0 ? -0.38 : 0.38,
      0,
      Math.PI * 2,
    )
    context.fill()
  }
  setMaskColor(context, 'centre')
  context.beginPath()
  context.ellipse(stemX + 4, 50, 6, 10, 0, 0, Math.PI * 2)
  context.fill()
}

function drawBranchingFlowers(context: CanvasRenderingContext2D, x: number): void {
  const stemX = x + 73
  drawStem(
    context,
    [
      [stemX, 249],
      [stemX - 3, 185],
      [stemX + 8, 133],
      [stemX + 24, 68],
    ],
    6,
  )
  drawStem(
    context,
    [
      [stemX + 2, 184],
      [stemX - 31, 139],
      [stemX - 43, 108],
    ],
    5,
  )
  drawStem(
    context,
    [
      [stemX + 9, 139],
      [stemX + 43, 113],
    ],
    5,
  )
  drawLeaf(context, stemX - 1, 197, Math.PI * 0.83, 47)
  drawLeaf(context, stemX + 4, 162, -Math.PI * 0.64, 43)
  drawLeaf(context, stemX + 14, 139, Math.PI * 0.64, 35)
  drawPetals(context, stemX + 24, 55, 31, 8)
  drawPetals(context, stemX - 45, 98, 23, 7)
  drawPetals(context, stemX + 49, 108, 21, 7)
}
