/**
 * 二角形实验的场景构造（实验页与讲解渲染器共用）
 */

import type { SphericalPatch, SpherePath, SphereMarker } from '../../lib/drawSphere'
import {
  luneQuadGrid, luneBoundary, luneEdgeCircles, regularSphericalPolygon,
  polygonBoundary, luneArea, polygonArea, polygonAngleSum, planarAngleSum,
  LUNE_APEX_NORTH, LUNE_APEX_SOUTH,
} from './sphericalLune'
import type { Vec3 } from '../../lib/proj3d'

export type LuneMode = 'lune' | 'polygon'

export interface LuneScene {
  patches: SphericalPatch[]
  paths: SpherePath[]
  markers: SphereMarker[]
  greatCircles: Vec3[]
  title: string
  subtitle: string
  readout: string
}

/** 二角形模式：经纬网格铺出月牙 + 两条边所在的整个大圆 */
export function buildLuneScene(alpha: number): LuneScene {
  const area = luneArea(alpha)
  return {
    // 每个小四边形单独作为一块 patch: 它们是近似平的, 面心扇形不会退化
    // 网格取密一些: 小片之间的抗锯齿缝隙在稀网格下会看成白点
    patches: luneQuadGrid(alpha, 22, 44).map((q) => ({
      vertices: q,
      fill: 'rgba(251, 191, 36, 0.5)',
      stroke: false,
    })),
    paths: [{
      points: luneBoundary(alpha, 60),
      color: 'rgba(251,191,36,1)',
      width: 2.6,
    }],
    markers: [
      { point: LUNE_APEX_NORTH, label: '北极' },
      { point: LUNE_APEX_SOUTH, label: '南极' },
    ],
    greatCircles: luneEdgeCircles(alpha),
    title: `球面二角形 α = ${((alpha * 180) / Math.PI).toFixed(0)}°`,
    subtitle: `面积 2α = ${area.toFixed(4)} · 占球面 ${((area / (4 * Math.PI)) * 100).toFixed(2)}%`,
    readout: `平面上不存在二角形`,
  }
}

/** 多边形模式：一块球面正 n 边形 */
export function buildPolygonScene(n: number, latDeg: number): LuneScene {
  const lat = (latDeg * Math.PI) / 180
  const poly = regularSphericalPolygon(n, lat)
  const area = polygonArea(poly)
  const sum = polygonAngleSum(poly)
  const planar = planarAngleSum(n)
  return {
    patches: [{ vertices: poly, fill: 'rgba(129, 230, 217, 0.45)' }],
    paths: [{
      points: polygonBoundary(poly, 30),
      color: 'rgba(251,191,36,1)',
      width: 2.6,
    }],
    markers: poly.map((p, i) => ({ point: p, label: `V${i + 1}` })),
    greatCircles: [],
    title: `球面正 ${n} 边形`,
    subtitle: `内角和 ${((sum * 180) / Math.PI).toFixed(2)}° · 平面为 ${((planar * 180) / Math.PI).toFixed(0)}°`,
    readout: `面积 = 内角和 − (n−2)π = ${area.toFixed(4)}`,
  }
}

export function buildScene(
  mode: LuneMode, alpha: number, n: number, latDeg: number,
): LuneScene {
  return mode === 'lune' ? buildLuneScene(alpha) : buildPolygonScene(n, latDeg)
}
