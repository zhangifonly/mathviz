/**
 * 维维亚尼曲线实验的右侧面板
 *
 * 从 Experiment 抽出来，让主组件保持在 100 行以内。
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  sphereResidual, cylinderResidual, vivianiWindowArea,
  sphereRadius, cylinderRadius, PRESETS,
} from './vivianiCurve'

export interface SidePanelProps {
  a: number
  halfOnly: boolean
  onA: (v: number) => void
  onToggleHalf: () => void
}

export default function SidePanel({ a, halfOnly, onA, onToggleHalf }: SidePanelProps) {
  const probes = [0.5, 2, 5, 9]
  const maxSphere = Math.max(...probes.map((t) => Math.abs(sphereResidual(t, a))))
  const maxCyl = Math.max(...probes.map((t) => Math.abs(cylinderResidual(t, a))))

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">尺度 a：{a.toFixed(2)}</h3>
        <input
          type="range" min={0.6} max={1.5} step={0.02} value={a}
          onChange={(e) => onA(Number(e.target.value))}
          className="w-full" aria-label="尺度 a"
        />
        <div className="mt-3 space-y-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => onA(p.a)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${Math.abs(a - p.a) < 1e-9 ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <span>{p.label}</span><span className="text-xs opacity-70">{p.note}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onToggleHalf}
          className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${halfOnly ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
        >
          {halfOnly ? '⚠ 正在只画 [0,2π]' : '演示周期陷阱：只画 [0,2π]'}
        </button>
      </div>

      <CurveFactsCard
        rows={[
          ['球半径 2a =', sphereRadius(a).toFixed(2)],
          ['柱半径 a =', cylinderRadius(a).toFixed(2)],
          ['球面残差', maxSphere.toExponential(1), '应为 0'],
          ['柱面残差', maxCyl.toExponential(1), '应为 0'],
          ['维维亚尼窗剩余面积 4a² =', vivianiWindowArea(a).toFixed(3)],
        ]}
        facts={[
          ['周期是 4π', '：z 含 sin(t/2)，只取 [0,2π] 会漏掉下半条曲线。'],
          ['三个投影', '：xy 得圆、xz 得抛物线、yz 得双纽线。'],
          ['1692 年的问题', '：剩余面积 4a² 不含 π，故可尺规作图。'],
        ]}
      />
    </div>
  )
}
