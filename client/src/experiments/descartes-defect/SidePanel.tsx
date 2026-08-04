/**
 * Descartes 角亏实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  solidOf, allDefects, totalDefect, defectResidual, eulerFromDefect,
  angleSumAt, totalFaceAngleAnalytic, faceSideSum, defectSpread,
  SOLID_IDS, PLATONIC_DEFECTS, GAUSS_BONNET_FACES, type PlatonicId,
} from './descartesDefect'
import { eulerCount, edgesOf } from '../../lib/polyhedron'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  solidId: PlatonicId
  showDefects: boolean
  faceAlpha: number
  onSolid: (id: PlatonicId) => void
  onToggleDefects: () => void
  onFaceAlpha: (v: number) => void
}

export default function SidePanel(props: SidePanelProps) {
  const {
    solidId, showDefects, faceAlpha, onSolid, onToggleDefects, onFaceAlpha,
  } = props
  const p = solidOf(solidId)
  const { V, E, F, chi } = eulerCount(p)
  const d = allDefects(p)
  const total = totalDefect(p)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择立体</h3>
        <div className="space-y-2">
          {SOLID_IDS.map((id) => {
            const t = PLATONIC_DEFECTS[id]
            return (
              <button
                key={id}
                onClick={() => onSolid(id)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${solidId === id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
              >
                <div className="flex justify-between">
                  <span>{solidOf(id).name}</span>
                  <span className="text-xs opacity-70">
                    {t.count} × {(t.perVertex * DEG).toFixed(0)}°
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        <button
          onClick={onToggleDefects}
          className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${showDefects ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
        >
          {showDefects ? '✓ 标出角亏' : '标出角亏'}
        </button>
        <label className="block mt-3 text-sm font-medium text-gray-700">
          面透明度 {faceAlpha.toFixed(2)}
        </label>
        <input
          type="range" min={0} max={0.85} step={0.05} value={faceAlpha}
          onChange={(e) => onFaceAlpha(Number(e.target.value))}
          className="w-full mt-1"
        />
      </div>

      <CurveFactsCard
        title="角亏读数"
        rows={[
          ['(V, E, F)', `(${V}, ${E}, ${F})`, `χ = ${chi}`],
          ['每顶点角亏 δ', `${(d[0] * DEG).toFixed(4)}°`, `理论 ${(PLATONIC_DEFECTS[solidId].perVertex * DEG).toFixed(0)}°`],
          ['顶点处面角和', `${(angleSumAt(p, 0) * DEG).toFixed(4)}°`, '恒 < 360°'],
          ['角亏极差', defectSpread(p).toExponential(1), '处处相等'],
          ['角亏总和 Σδ', total.toFixed(8)],
          ['4π', (4 * Math.PI).toFixed(8), '两者相等'],
          ['残差', defectResidual(p).toExponential(1), '应为 0'],
          ['Σδ / 2π', eulerFromDefect(p).toFixed(8), `= χ = ${chi}`],
          ['面角总和 Σ(nᵢ−2)π', totalFaceAngleAnalytic(p).toFixed(6)],
          ['Σ面的边数', `${faceSideSum(p)}`, `= 2E = ${2 * edgesOf(p).length}`],
        ]}
        facts={[
          ['角亏 δ = 2π − 顶点处面角和', '，凸多面体上恒为正。'],
          ['Σδ = 4π 与顶点个数无关', `：${V} 个顶点各 ${(d[0] * DEG).toFixed(0)}°，乘起来正好。`],
          ['它与欧拉公式等价', '：Σδ/2π 恰好就是 χ = V−E+F。'],
          ['4π 是单位球的总曲率', '，角亏就是离散化的高斯曲率。'],
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold mb-2">高斯–博内的三种面孔</h3>
        <div className="space-y-2 text-xs">
          {GAUSS_BONNET_FACES.map((g) => (
            <div key={g.where}>
              <div className="font-medium text-gray-700">{g.where}</div>
              <div className="text-gray-500">{g.quantity} → {g.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
