/**
 * 测地线实验的场景构造（实验页与讲解渲染器共用）
 *
 * 两处都要「三条路径 + 两个城市标记」，逻辑一模一样，抽出来避免重复。
 */

import type { SpherePath, SphereMarker } from '../../lib/drawSphere'
import {
  cityPoint, geodesicPath, parallelRoutePath, detourPath, greatCircleAngle,
  CITY_PAIRS, type CityName,
} from './geodesicShortestPath'

export interface RouteScene {
  paths: SpherePath[]
  markers: SphereMarker[]
  /** 大圆弧长（弧度） */
  gc: number
  pair: (typeof CITY_PAIRS)[number]
}

export function buildRouteScene(pairIndex: number, detour: number): RouteScene {
  const idx = Math.max(0, Math.min(CITY_PAIRS.length - 1, pairIndex))
  const pair = CITY_PAIRS[idx]
  const a = cityPoint(pair.from as CityName)
  const b = cityPoint(pair.to as CityName)

  const paths: SpherePath[] = [
    {
      points: parallelRoutePath(a, b, 120),
      color: 'rgba(148,163,184,0.95)',
      width: 2,
      label: '沿纬线航线',
    },
    {
      points: geodesicPath(a, b, 120),
      color: 'rgba(251,191,36,1)',
      width: 3,
      label: '大圆弧（最短）',
    },
  ]
  // 偏移极小时不画红线, 否则它与黄线重合看不出区别
  if (detour > 0.01) {
    paths.push({
      points: detourPath(a, b, detour, 120),
      color: 'rgba(248,113,113,0.95)',
      width: 2,
      label: '绕道路径',
    })
  }

  return {
    paths,
    markers: [
      { point: a, label: pair.from },
      { point: b, label: pair.to },
    ],
    gc: greatCircleAngle(a, b),
    pair,
  }
}
