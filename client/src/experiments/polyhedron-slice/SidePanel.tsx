/**
 * 多面体截面实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  baseSolid, sliceOf, sliceArea, slicePerimeter, sliceRegularity,
  sliceAngles, isRegularSlice, maxSliceSides, extentAlong, unit,
  PRESETS, type PlatonicId,
} from './polyhedronSlice'
import type { Vec3 } from '../../lib/proj3d'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  solidId: PlatonicId
  normal: Vec3
  d: number
  onPreset: (id: string) => void
  onD: (v: number) => void
  presetId: string
}

export default function SidePanel(props: SidePanelProps) {
  const { solidId, normal, d, onPreset, onD, presetId } = props
  const poly = baseSolid(solidId)
  const plane = { n: unit(normal), d }
  const ring = sliceOf(poly, plane)
  const [lo, hi] = extentAlong(poly, unit(normal))
  const angs = ring.length >= 3 ? sliceAngles(ring) : []

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">经典切法</h3>
        <div className="space-y-2">
          {PRESETS.map((ps) => (
            <button
              key={ps.id}
              onClick={() => onPreset(ps.id)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${presetId === ps.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div className="flex justify-between">
                <span>{ps.label}</span>
                <span className="text-xs opacity-70">{ps.expect}</span>
              </div>
              <div className="text-xs opacity-70 mt-0.5">{ps.note}</div>
            </button>
          ))}
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          切平面位置 d = {d.toFixed(4)}
        </label>
        <input
          type="range" min={lo} max={hi} step={(hi - lo) / 200} value={d}
          onChange={(e) => onD(Number(e.target.value))}
          className="w-full mt-1"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{lo.toFixed(2)}</span>
          <span>中心 0</span>
          <span>{hi.toFixed(2)}</span>
        </div>
      </div>

      <CurveFactsCard
        title="截面读数"
        rows={[
          ['截面边数', ring.length >= 3 ? `${ring.length}` : '无截面'],
          ['是否正多边形', ring.length >= 3 ? (isRegularSlice(ring) ? '是 ✓' : '否') : '—'],
          ['边长极差', ring.length >= 3 ? `${(sliceRegularity(ring) * 100).toFixed(3)}%` : '—'],
          ['内角', angs.length > 0 ? `${(angs[0] * DEG).toFixed(2)}°…` : '—'],
          ['面积', ring.length >= 3 ? sliceArea(ring).toFixed(6) : '0'],
          ['周长', ring.length >= 3 ? slicePerimeter(ring).toFixed(6) : '0'],
          ['边数上界', `${maxSliceSides(poly)}`, '= 面数 F'],
          ['切向跨度', `[${lo.toFixed(3)}, ${hi.toFixed(3)}]`],
        ]}
        facts={[
          ['立方体能切出正六边形', '：沿体对角线过中心，六条边等长、内角都是 120°。'],
          ['正四面体能切出正方形', '：四个三角面的立体，切口却是四边形。'],
          ['边数不超过面数', '，因为切口每条边都来自一个面。'],
          ['只有中心那一刀是正的', '：两侧同样是六边形，但边长不齐。'],
        ]}
      />
    </div>
  )
}
