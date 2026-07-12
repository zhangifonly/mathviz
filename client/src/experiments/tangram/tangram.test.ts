import { describe, it, expect } from 'vitest'
import {
  TANGRAM_PIECES,
  SIZE,
  SHAPE_OPTIONS,
  polygonArea,
  polygonCentroid,
  rotatePolygon,
  translatePolygon,
  totalArea,
  tangramPieces,
} from './tangram'

describe('七巧板数学内核', () => {
  it('恰好 7 块', () => {
    expect(TANGRAM_PIECES.length).toBe(7)
  })

  it('鞋带公式：单位正方形面积为 1', () => {
    expect(polygonArea([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }])).toBeCloseTo(1)
  })

  it('鞋带公式：底 2 高 3 的三角形面积为 3', () => {
    expect(polygonArea([{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 3 }])).toBeCloseTo(3)
  })

  it('各块面积与其单位数一致（小三角面积=1）', () => {
    for (const p of TANGRAM_PIECES) {
      expect(polygonArea(p.vertices)).toBeCloseTo(p.units)
    }
  })

  it('单位数合计为 16', () => {
    const sum = TANGRAM_PIECES.reduce((s, p) => s + p.units, 0)
    expect(sum).toBe(16)
  })

  it('面积守恒：七块之和恒等于原正方形面积 SIZE²', () => {
    expect(totalArea()).toBeCloseTo(SIZE * SIZE)
    expect(totalArea()).toBeCloseTo(16)
  })

  it('所有块顶点都落在 [0,SIZE] 范围内', () => {
    for (const p of TANGRAM_PIECES) {
      for (const v of p.vertices) {
        expect(v.x).toBeGreaterThanOrEqual(0)
        expect(v.x).toBeLessThanOrEqual(SIZE)
        expect(v.y).toBeGreaterThanOrEqual(0)
        expect(v.y).toBeLessThanOrEqual(SIZE)
      }
    }
  })

  it('两个大三角全等（面积均为 4）', () => {
    const larges = TANGRAM_PIECES.filter((p) => p.id.startsWith('large'))
    expect(larges.length).toBe(2)
    expect(polygonArea(larges[0].vertices)).toBeCloseTo(polygonArea(larges[1].vertices))
  })

  it('两个小三角全等（面积均为 1）', () => {
    const smalls = TANGRAM_PIECES.filter((p) => p.id.startsWith('small'))
    expect(smalls.length).toBe(2)
    expect(polygonArea(smalls[0].vertices)).toBeCloseTo(1)
    expect(polygonArea(smalls[1].vertices)).toBeCloseTo(1)
  })

  it('大三角面积是小三角的 4 倍', () => {
    const big = TANGRAM_PIECES.find((p) => p.id === 'large1')!
    const small = TANGRAM_PIECES.find((p) => p.id === 'small1')!
    expect(polygonArea(big.vertices)).toBeCloseTo(4 * polygonArea(small.vertices))
  })

  it('旋转 360 度回到原位', () => {
    const poly = TANGRAM_PIECES[0].vertices
    const c = polygonCentroid(poly)
    const rot = rotatePolygon(poly, 360, c)
    poly.forEach((p, i) => {
      expect(rot[i].x).toBeCloseTo(p.x)
      expect(rot[i].y).toBeCloseTo(p.y)
    })
  })

  it('旋转是刚体变换，面积不变', () => {
    const poly = TANGRAM_PIECES[5].vertices
    const c = polygonCentroid(poly)
    expect(polygonArea(rotatePolygon(poly, 37, c))).toBeCloseTo(polygonArea(poly))
  })

  it('平移不改变面积', () => {
    const poly = TANGRAM_PIECES[1].vertices
    expect(polygonArea(translatePolygon(poly, 5, -3))).toBeCloseTo(polygonArea(poly))
  })

  it('tangramPieces 返回深拷贝，改动不影响原数据', () => {
    const copy = tangramPieces()
    copy[0].vertices[0].x = 999
    expect(TANGRAM_PIECES[0].vertices[0].x).toBe(0)
  })

  it('SHAPE_OPTIONS 每个目标图形面积都等于 16（面积守恒）', () => {
    expect(SHAPE_OPTIONS.length).toBeGreaterThan(0)
    for (const opt of SHAPE_OPTIONS) {
      expect(polygonArea(opt.outline)).toBeCloseTo(16)
    }
  })

  it('SHAPE_OPTIONS 的 id/label 都非空且唯一', () => {
    const ids = SHAPE_OPTIONS.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const o of SHAPE_OPTIONS) {
      expect(o.id.length).toBeGreaterThan(0)
      expect(o.label.length).toBeGreaterThan(0)
    }
  })
})
