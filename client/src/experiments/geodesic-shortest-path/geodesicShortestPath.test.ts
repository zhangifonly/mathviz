import { describe, it, expect } from 'vitest'
import {
  cityPoint, greatCircleAngle, toKilometers, parallelRoutePathLength,
  parallelRoutePath, pathLength, geodesicPath, detourPath, detourLength,
  parallelGeodesicCurvature, numericGeodesicCurvature, parallelPath,
  isAntipodal, maxLatitudeOnRoute, CITIES, CITY_PAIRS,
  EARTH_RADIUS_KM, GREAT_CIRCLE_GEODESIC_CURVATURE,
} from './geodesicShortestPath'
import { norm, fromLatLon, sphericalDistance, toLatLon } from '../../lib/sphere3d'

const DEG = 180 / Math.PI

describe('测地线 - 大圆弧最短', () => {
  it('六个城市的坐标都在单位球上', () => {
    for (const c of CITIES) {
      expect(norm(cityPoint(c.name))).toBeCloseTo(1, 12)
    }
  })

  it('城市经纬度往返一致', () => {
    for (const c of CITIES) {
      const back = toLatLon(cityPoint(c.name))
      expect(back.lat * DEG).toBeCloseTo(c.lat, 6)
      expect(back.lon * DEG).toBeCloseTo(c.lon, 6)
    }
  })

  it('大圆弧比沿纬线的航线短(四个城市对都成立)', () => {
    for (const p of CITY_PAIRS) {
      const a = cityPoint(p.from)
      const b = cityPoint(p.to)
      expect(greatCircleAngle(a, b)).toBeLessThan(parallelRoutePathLength(a, b))
    }
  })

  it('北京到纽约的大圆距离约 11000 公里', () => {
    const d = toKilometers(greatCircleAngle(cityPoint('北京'), cityPoint('纽约')))
    expect(d).toBeGreaterThan(10800)
    expect(d).toBeLessThan(11200)
  })

  it('北京到纽约走纬线要多出 30% 以上', () => {
    const a = cityPoint('北京')
    const b = cityPoint('纽约')
    const ratio = parallelRoutePathLength(a, b) / greatCircleAngle(a, b)
    expect(ratio).toBeGreaterThan(1.25)
  })

  it('大圆航线最高纬度远高于两端城市 —— 航班往北飞的原因', () => {
    const a = cityPoint('北京')
    const b = cityPoint('纽约')
    const maxLat = maxLatitudeOnRoute(a, b) * DEG
    // 两城市纬度都在 40° 左右, 但航线要爬到 80° 以上
    expect(maxLat).toBeGreaterThan(75)
    expect(toLatLon(a).lat * DEG).toBeLessThan(45)
    expect(toLatLon(b).lat * DEG).toBeLessThan(45)
  })

  it('采样出的纬线路径长度与解析式一致', () => {
    for (const p of CITY_PAIRS) {
      const a = cityPoint(p.from)
      const b = cityPoint(p.to)
      const sampled = pathLength(parallelRoutePath(a, b, 400))
      const analytic = parallelRoutePathLength(a, b)
      // 折线采样会略有差异, 但量级须一致
      expect(sampled / analytic).toBeGreaterThan(0.9)
      expect(sampled / analytic).toBeLessThan(1.1)
    }
  })

  it('大圆弧采样长度精确等于球面距离', () => {
    for (const p of CITY_PAIRS) {
      const a = cityPoint(p.from)
      const b = cityPoint(p.to)
      expect(pathLength(geodesicPath(a, b, 400)))
        .toBeCloseTo(greatCircleAngle(a, b), 8)
    }
  })

  it('地球半径常量正确', () => {
    expect(EARTH_RADIUS_KM).toBe(6371)
    // 赤道周长约 40030 km
    expect(toKilometers(2 * Math.PI)).toBeGreaterThan(40000)
    expect(toKilometers(2 * Math.PI)).toBeLessThan(40100)
  })
})

describe('测地线 - 任何绕道都更长', () => {
  const a = cityPoint('北京')
  const b = cityPoint('纽约')

  it('偏移为零时长度精确等于大圆弧', () => {
    expect(detourLength(a, b, 0)).toBeCloseTo(greatCircleAngle(a, b), 8)
  })

  it('偏移越大路径越长(单调)', () => {
    const ls = [0, 0.1, 0.3, 0.6, 1.0].map((o) => detourLength(a, b, o))
    for (let i = 1; i < ls.length; i++) {
      expect(ls[i]).toBeGreaterThan(ls[i - 1])
    }
  })

  it('任何非零偏移都严格长于大圆弧', () => {
    const gc = greatCircleAngle(a, b)
    for (const o of [0.05, 0.2, 0.5, 0.9]) {
      expect(detourLength(a, b, o)).toBeGreaterThan(gc)
    }
  })

  it('绕道路径的端点仍是 a 与 b', () => {
    const path = detourPath(a, b, 0.4, 60)
    expect(sphericalDistance(path[0], a)).toBeLessThan(1e-9)
    expect(sphericalDistance(path[path.length - 1], b)).toBeLessThan(1e-9)
  })

  it('绕道路径的点都在单位球上', () => {
    for (const p of detourPath(a, b, 0.5, 40)) {
      expect(norm(p)).toBeCloseTo(1, 9)
    }
  })

  it('对多个城市对都成立', () => {
    for (const pair of CITY_PAIRS) {
      const x = cityPoint(pair.from)
      const y = cityPoint(pair.to)
      expect(detourLength(x, y, 0.3)).toBeGreaterThan(greatCircleAngle(x, y))
    }
  })
})

describe('测地线 - 测地曲率', () => {
  it('大圆弧的测地曲率为零(球面上的直线)', () => {
    expect(GREAT_CIRCLE_GEODESIC_CURVATURE).toBe(0)
    const path = geodesicPath(cityPoint('北京'), cityPoint('纽约'), 200)
    let maxCurv = 0
    for (let i = 1; i < path.length - 1; i++) {
      maxCurv = Math.max(maxCurv, numericGeodesicCurvature(path, i))
    }
    expect(maxCurv).toBeLessThan(1e-8)
  })

  it('纬线的测地曲率等于 |tan(纬度)|', () => {
    for (const latDeg of [0, 30, 45, 60]) {
      const lat = (latDeg * Math.PI) / 180
      const path = parallelPath(lat, 0, Math.PI / 2, 200)
      let mx = 0
      for (let i = 1; i < path.length - 1; i++) {
        mx = Math.max(mx, numericGeodesicCurvature(path, i))
      }
      expect(mx).toBeCloseTo(parallelGeodesicCurvature(lat), 4)
    }
  })

  it('赤道是大圆, 测地曲率为零', () => {
    expect(parallelGeodesicCurvature(0)).toBe(0)
    const eq = parallelPath(0, 0, Math.PI, 100)
    let mx = 0
    for (let i = 1; i < eq.length - 1; i++) {
      mx = Math.max(mx, numericGeodesicCurvature(eq, i))
    }
    expect(mx).toBeLessThan(1e-9)
  })

  it('纬度越高纬线越弯', () => {
    const cs = [10, 30, 50, 70].map((d) => parallelGeodesicCurvature((d * Math.PI) / 180))
    for (let i = 1; i < cs.length; i++) {
      expect(cs[i]).toBeGreaterThan(cs[i - 1])
    }
  })

  it('45° 纬线的测地曲率恰为 1, 60° 恰为 √3', () => {
    expect(parallelGeodesicCurvature(Math.PI / 4)).toBeCloseTo(1, 12)
    expect(parallelGeodesicCurvature(Math.PI / 3)).toBeCloseTo(Math.sqrt(3), 12)
  })
})

describe('测地线 - 对径点的退化', () => {
  it('对径点判据正确', () => {
    const n = fromLatLon(Math.PI / 2, 0)
    const s = fromLatLon(-Math.PI / 2, 0)
    expect(isAntipodal(n, s)).toBe(true)
    expect(isAntipodal(n, fromLatLon(0, 0))).toBe(false)
  })

  it('对径点的距离恰为 π', () => {
    for (const [lat, lon] of [[0, 0], [0.5, 1.2], [-0.9, 2.5]]) {
      const a = fromLatLon(lat, lon)
      const b = fromLatLon(-lat, lon + Math.PI)
      expect(sphericalDistance(a, b)).toBeCloseTo(Math.PI, 9)
      expect(isAntipodal(a, b, 1e-8)).toBe(true)
    }
  })

  it('对径点之间经过不同中间点的路径长度都是 π(最短路径不唯一)', () => {
    const a = fromLatLon(0, 0)
    const b = fromLatLon(0, Math.PI)
    // 经过北极或经过赤道上另一点, 长度都是 π
    for (const via of [fromLatLon(Math.PI / 2, 0), fromLatLon(0, Math.PI / 2),
      fromLatLon(-Math.PI / 2, 0)]) {
      const len = sphericalDistance(a, via) + sphericalDistance(via, b)
      expect(len).toBeCloseTo(Math.PI, 8)
    }
  })

  it('四个城市对都不是对径点', () => {
    for (const p of CITY_PAIRS) {
      expect(isAntipodal(cityPoint(p.from), cityPoint(p.to))).toBe(false)
    }
  })

  it('CITY_PAIRS 的注记都有内容', () => {
    expect(CITY_PAIRS.length).toBe(4)
    for (const p of CITY_PAIRS) {
      expect(p.note.length).toBeGreaterThan(3)
      expect(CITIES.some((c) => c.name === p.from)).toBe(true)
      expect(CITIES.some((c) => c.name === p.to)).toBe(true)
    }
  })
})
