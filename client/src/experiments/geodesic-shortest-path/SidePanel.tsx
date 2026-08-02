/**
 * 测地线实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import { toLatLon } from '../../lib/sphere3d'
import {
  cityPoint, greatCircleAngle, toKilometers, parallelRoutePathLength,
  detourLength, maxLatitudeOnRoute, parallelGeodesicCurvature,
  CITY_PAIRS, type CityName,
} from './geodesicShortestPath'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  pairIndex: number
  detour: number
  onPair: (i: number) => void
  onDetour: (v: number) => void
}

export default function SidePanel({
  pairIndex, detour, onPair, onDetour,
}: SidePanelProps) {
  const pair = CITY_PAIRS[pairIndex]
  const a = cityPoint(pair.from as CityName)
  const b = cityPoint(pair.to as CityName)
  const gc = greatCircleAngle(a, b)
  const par = parallelRoutePathLength(a, b)
  const det = detourLength(a, b, detour)
  const maxLat = maxLatitudeOnRoute(a, b) * DEG
  const latA = toLatLon(a).lat * DEG
  const latB = toLatLon(b).lat * DEG

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择航线</h3>
        <div className="space-y-2">
          {CITY_PAIRS.map((p, i) => (
            <button
              key={`${p.from}-${p.to}`}
              onClick={() => onPair(i)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${pairIndex === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div>{p.from} → {p.to}</div>
              <div className="text-xs opacity-70 mt-0.5">{p.note}</div>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">绕道偏移：{detour.toFixed(2)}</h3>
        <input
          type="range" min={0} max={1} step={0.02} value={detour}
          onChange={(e) => onDetour(Number(e.target.value))}
          className="w-full" aria-label="绕道偏移"
        />
        <p className="text-xs text-gray-500 mt-1">
          任何非零偏移都会让路径变长
        </p>
      </div>

      <CurveFactsCard
        title="三条路径的长度"
        rows={[
          ['大圆弧（测地线）', `${toKilometers(gc).toFixed(0)} km`, '最短'],
          ['沿纬线航线', `${toKilometers(par).toFixed(0)} km`, `多 ${((par / gc - 1) * 100).toFixed(1)}%`],
          ['绕道路径', `${toKilometers(det).toFixed(0)} km`, detour > 0 ? `多 ${((det / gc - 1) * 100).toFixed(1)}%` : '与大圆重合'],
          ['两端纬度', `${latA.toFixed(1)}° / ${latB.toFixed(1)}°`],
          ['航线最高纬度', `${maxLat.toFixed(1)}°`, '故要往高纬飞'],
          ['大圆测地曲率', '0', '球面上的直线'],
          ['45° 纬线测地曲率', parallelGeodesicCurvature(Math.PI / 4).toFixed(4), '= 1，是弯的'],
        ]}
        facts={[
          ['大圆弧是最短路径', '：任何偏离它的路径都严格更长。'],
          ['测地曲率为零', ' 才算「球面上的直线」，纬线（除赤道）不是。'],
          ['航班往北飞', '：大圆航线的最高纬度远高于两端城市。'],
          ['对径点例外', '：此时有无穷多条等长的最短路径，长度都是 π。'],
        ]}
      />
    </div>
  )
}
