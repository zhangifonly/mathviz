/**
 * 截角变换实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  baseSolid, truncate, standardTOf, standardT, predictedCounts,
  edgeUniformity, RECTIFY_T, SOLID_IDS, TRUNCATION_NAMES, SOCCER_BALL,
  type PlatonicId,
} from './truncation'
import { profileText } from './draw'
import { eulerCount } from '../../lib/polyhedron'

export interface SidePanelProps {
  solidId: PlatonicId
  t: number
  showBase: boolean
  onSolid: (id: PlatonicId) => void
  onT: (v: number) => void
  onToggleBase: () => void
}

export default function SidePanel(props: SidePanelProps) {
  const { solidId, t, showBase, onSolid, onT, onToggleBase } = props
  const base = baseSolid(solidId)
  const st = standardTOf(base)
  const poly = truncate(base, t)
  const before = eulerCount(base)
  const after = eulerCount(poly)
  const pred = predictedCounts(base, t)
  const names = TRUNCATION_NAMES[solidId]
  const sides = base.faces[0]?.length ?? 3

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择原立体</h3>
        <div className="space-y-2">
          {SOLID_IDS.map((id) => (
            <button
              key={id}
              onClick={() => onSolid(id)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${solidId === id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div className="flex justify-between">
                <span>{baseSolid(id).name}</span>
                <span className="text-xs opacity-70">
                  → {TRUNCATION_NAMES[id].std}
                </span>
              </div>
            </button>
          ))}
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          截角深度 t = {t.toFixed(4)}
        </label>
        <input
          type="range" min={0} max={0.5} step={0.005} value={t}
          onChange={(e) => onT(Number(e.target.value))}
          className="w-full mt-1"
        />
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={() => onT(0)}
            className="px-2 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            原体 0
          </button>
          <button
            onClick={() => onT(st)}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium ${Math.abs(t - st) < 1e-6 ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            标准 {st.toFixed(3)}
          </button>
          <button
            onClick={() => onT(RECTIFY_T)}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium ${Math.abs(t - RECTIFY_T) < 1e-6 ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            整流 0.5
          </button>
        </div>
        <button
          onClick={onToggleBase}
          className={`w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium ${showBase ? 'bg-blue-400 text-blue-900' : 'bg-gray-100 text-gray-600'}`}
        >
          {showBase ? '✓ 叠加原立体' : '叠加原立体'}
        </button>
      </div>

      <CurveFactsCard
        title="截角读数"
        rows={[
          ['原 (V, E, F)', `(${before.V}, ${before.E}, ${before.F})`],
          ['现 (V, E, F)', `(${after.V}, ${after.E}, ${after.F})`, `预测 (${pred.V}, ${pred.E}, ${pred.F})`],
          ['欧拉数 χ', `${after.chi}`, '拓扑不变'],
          ['面型', profileText(poly)],
          ['棱长齐否', edgeUniformity(poly) < 1e-9 ? '等长 ✓' : `极差 ${(edgeUniformity(poly) * 100).toFixed(1)}%`],
          ['本立体的标准 t', st.toFixed(6), `= 1/(2+2sin(θ/2))，${sides} 边面`],
          ['三角面的 t', standardT(3).toFixed(6), '= 1/3'],
          ['标准截角得到', names.std],
          ['整流得到', names.rect],
        ]}
        facts={[
          ['V′ = 2E，E′ = 3E，F′ = F + V', '，代回欧拉公式仍是 2。'],
          ['标准 t = 1/(2 + 2sin(θ/2))', `，只有三角面才恰好是 1/3。`],
          ['t = 1/2 是整流', '：立方体与八面体都归到立方八面体。'],
          [`${SOCCER_BALL.note}`, '：12 个五边形 + 20 个六边形。'],
        ]}
      />
    </div>
  )
}
