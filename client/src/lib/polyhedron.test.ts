import { describe, it, expect } from 'vitest'
import {
  edgesOf, eulerCount, faceCenter, faceOutward, centroidOf,
  facePlanarityError, edgeLengths, isEquilateral, volumeOf, surfaceAreaOf,
  circumradius, isSpherical, vertexDegrees, faceSizeHistogram,
  type Polyhedron,
} from './polyhedron'

/** 单位立方体（边长 2，中心在原点） */
const cube: Polyhedron = {
  name: '立方体',
  vertices: [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
  ],
  faces: [
    [0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4],
    [2, 3, 7, 6], [1, 2, 6, 5], [0, 4, 7, 3],
  ],
}

/** 正四面体 */
const tetra: Polyhedron = {
  name: '四面体',
  vertices: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
  faces: [[0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]],
}

describe('polyhedron - 棱与欧拉公式', () => {
  it('从面表推出的棱数正确且去重', () => {
    expect(edgesOf(cube).length).toBe(12)
    expect(edgesOf(tetra).length).toBe(6)
  })

  it('棱表无重复', () => {
    const es = edgesOf(cube)
    const keys = new Set(es.map(([a, b]) => `${a}-${b}`))
    expect(keys.size).toBe(es.length)
  })

  it('棱的下标规范化(小的在前)', () => {
    for (const [a, b] of edgesOf(cube)) expect(a).toBeLessThan(b)
  })

  it('欧拉公式 V−E+F = 2', () => {
    expect(eulerCount(cube)).toEqual({ V: 8, E: 12, F: 6, chi: 2 })
    expect(eulerCount(tetra)).toEqual({ V: 4, E: 6, F: 4, chi: 2 })
  })
})

describe('polyhedron - 几何量', () => {
  it('形心在原点', () => {
    const c = centroidOf(cube)
    for (const x of c) expect(Math.abs(x)).toBeLessThan(1e-12)
  })

  it('面心正确: 立方体底面的面心是 (0,0,-1)', () => {
    const fc = faceCenter(cube, 0)
    expect(fc[0]).toBeCloseTo(0, 12)
    expect(fc[1]).toBeCloseTo(0, 12)
    expect(fc[2]).toBeCloseTo(-1, 12)
  })

  it('所有面的法向都朝外', () => {
    for (let i = 0; i < cube.faces.length; i++) {
      expect(faceOutward(cube, i)).toBe(true)
    }
    for (let i = 0; i < tetra.faces.length; i++) {
      expect(faceOutward(tetra, i)).toBe(true)
    }
  })

  it('顶点顺序反了法向就朝内 —— 这个判据确实有区分力', () => {
    const flipped: Polyhedron = {
      ...cube,
      faces: cube.faces.map((f) => [...f].reverse()),
    }
    for (let i = 0; i < flipped.faces.length; i++) {
      expect(faceOutward(flipped, i)).toBe(false)
    }
  })

  it('立方体的面共面(误差为零)', () => {
    for (let i = 0; i < cube.faces.length; i++) {
      expect(facePlanarityError(cube, i)).toBeLessThan(1e-12)
    }
  })

  it('三角面的共面误差恒为 0(三点必共面)', () => {
    for (let i = 0; i < tetra.faces.length; i++) {
      expect(facePlanarityError(tetra, i)).toBe(0)
    }
  })

  it('立方体棱长都是 2, 四面体棱长都是 2√2', () => {
    expect(edgeLengths(cube).every((l) => Math.abs(l - 2) < 1e-12)).toBe(true)
    expect(isEquilateral(cube)).toBe(true)
    const want = 2 * Math.SQRT2
    expect(edgeLengths(tetra).every((l) => Math.abs(l - want) < 1e-12)).toBe(true)
  })

  it('体积: 边长 2 的立方体为 8', () => {
    expect(volumeOf(cube)).toBeCloseTo(8, 10)
  })

  it('体积: 该四面体为立方体的 1/3', () => {
    // 顶点取自边长 2 的立方体的交替顶点, 体积为 8/3
    expect(volumeOf(tetra)).toBeCloseTo(8 / 3, 10)
  })

  it('表面积: 边长 2 的立方体为 24', () => {
    expect(surfaceAreaOf(cube)).toBeCloseTo(24, 10)
  })

  it('表面积: 四面体为 4 个边长 2√2 的正三角形', () => {
    const side = 2 * Math.SQRT2
    const want = 4 * (Math.sqrt(3) / 4) * side * side
    expect(surfaceAreaOf(tetra)).toBeCloseTo(want, 8)
  })

  it('外接球半径与共球性', () => {
    expect(circumradius(cube)).toBeCloseTo(Math.sqrt(3), 10)
    expect(isSpherical(cube)).toBe(true)
    expect(isSpherical(tetra)).toBe(true)
  })

  it('非正多面体不共球', () => {
    // ⚠️ 注意: 单纯把 x 坐标乘 2 仍然共球 —— 八个顶点到形心距离都是 √6。
    // 要破坏共球性, 必须只挪动部分顶点。
    const skewed: Polyhedron = {
      ...cube,
      vertices: cube.vertices.map(
        (v, i) => (i === 6 ? [v[0] * 2, v[1], v[2]] : v) as [number, number, number],
      ),
    }
    expect(isSpherical(skewed)).toBe(false)
    expect(isEquilateral(skewed)).toBe(false)
  })

  it('各向缩放仍保持共球(反例的反例)', () => {
    const stretched: Polyhedron = {
      ...cube,
      vertices: cube.vertices.map(([x, y, z]) => [x * 2, y, z] as [number, number, number]),
    }
    // 八个顶点到形心距离都是 √(4+1+1)=√6, 故仍共球
    expect(isSpherical(stretched)).toBe(true)
    // 但棱长不再相等
    expect(isEquilateral(stretched)).toBe(false)
  })

  it('立方体每个顶点度数为 3, 四面体也是 3', () => {
    expect(vertexDegrees(cube).every((d) => d === 3)).toBe(true)
    expect(vertexDegrees(tetra).every((d) => d === 3)).toBe(true)
  })

  it('度数之和等于 2E(握手定理)', () => {
    for (const p of [cube, tetra]) {
      const sum = vertexDegrees(p).reduce((a, b) => a + b, 0)
      expect(sum).toBe(2 * edgesOf(p).length)
    }
  })

  it('面边数直方图', () => {
    expect(faceSizeHistogram(cube)).toEqual({ 4: 6 })
    expect(faceSizeHistogram(tetra)).toEqual({ 3: 4 })
  })
})
