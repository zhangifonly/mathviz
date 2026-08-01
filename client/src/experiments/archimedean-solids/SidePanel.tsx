/**
 * 阿基米德立体实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import { eulerCount, isEquilateral, faceSizeHistogram } from '../../lib/polyhedron'
import { platonicOf } from '../platonic-solids/platonicSolids'
import {
  truncate, rectify, idealT, isSemiRegular, ARCHIMEDEAN_INFO, type TruncBase,
} from './archimedeanSolids'

export interface SidePanelProps {
  base: TruncBase
  t: number
  onBase: (b: TruncBase) => void
  onT: (v: number) => void
}

export default function SidePanel({ base, t, onBase, onT }: SidePanelProps) {
  // t=0.5 走 rectify: truncate 在该处会产生重合顶点, V/E/F 会算错
  const poly = Math.abs(t - 0.5) < 1e-6
    ? rectify(platonicOf(base))
    : truncate(platonicOf(base), t)
  const c = eulerCount(poly)
  const hist = faceSizeHistogram(poly)
  const ideal = idealT(base)
  const atIdeal = Math.abs(t - ideal) < 1e-6
  const histText = Object.entries(hist)
    .map(([sides, n]) => `${n}×${sides}边`)
    .join(' + ')

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">基础立体</h3>
        <div className="space-y-2">
          {ARCHIMEDEAN_INFO.map((i) => (
            <button
              key={i.base}
              onClick={() => { onBase(i.base); onT(idealT(i.base)) }}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${base === i.base ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div className="flex justify-between">
                <span>{i.label}</span>
                <span className="text-xs opacity-70">{i.V}/{i.E}/{i.F}</span>
              </div>
              <div className="text-xs opacity-70 mt-0.5">{i.faceDesc}</div>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">截角比例 t：{t.toFixed(4)}</h3>
        <input
          type="range" min={0.05} max={0.5} step={0.005} value={t}
          onChange={(e) => onT(Number(e.target.value))}
          className="w-full" aria-label="截角比例"
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onT(ideal)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${atIdeal ? 'bg-emerald-400 text-emerald-900' : 'bg-gray-100 text-gray-600'}`}
          >
            理想 {ideal.toFixed(3)}
          </button>
          <button
            onClick={() => onT(0.5)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${Math.abs(t - 0.5) < 1e-6 ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
          >
            截半 0.5
          </button>
        </div>
      </div>

      <CurveFactsCard
        title="验证读数"
        rows={[
          ['V − E + F =', String(c.chi), '欧拉公式要求为 2'],
          ['V / E / F =', `${c.V} / ${c.E} / ${c.F}`],
          ['面型', histText],
          ['半正(面为正多边形)', isSemiRegular(base, t) ? '✓' : '✗', atIdeal ? '理想比例' : '需理想比例'],
          ['整体等棱', isEquilateral(poly, 1e-6) ? '✓' : '✗'],
        ]}
        facts={[
          ['顶点数 = 原棱数 × 2', '，面数 = 原面数 + 原顶点数。'],
          ['理想比例随面型变', '：三角面 1/3，立方体 1/(2+√2)≈0.293。'],
          ['t = 0.5 退化为截半', '，立方体与正八面体截半结果相同。'],
        ]}
      />
    </div>
  )
}
