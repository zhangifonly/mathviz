/**
 * 圆锥螺线实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  coneResidual, projectionRadius, radiusAt, generatorAngle, growthPerTurn,
  CLASSIC, PRESETS,
} from './conicalSpiral'

export default function SidePanel({
  alpha, onAlpha,
}: { alpha: number; onAlpha: (v: number) => void }) {
  const p = { ...CLASSIC, alpha }
  const probes = [3, 9, 15, 21]
  const maxCone = Math.max(...probes.map((t) => Math.abs(coneResidual(t, p))))
  const maxProj = Math.max(
    ...probes.map((t) => Math.abs(projectionRadius(t, p) - radiusAt(t, p))),
  )
  const angs = probes.map((t) => generatorAngle(t, p))
  const angSpread = Math.max(...angs) - Math.min(...angs)
  const degrees = (angs[0] * 180) / Math.PI

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">
          半顶角：{((alpha * 180) / Math.PI).toFixed(1)}°
        </h3>
        <input
          type="range" min={0.3} max={1.2} step={0.01} value={alpha}
          onChange={(e) => onAlpha(Number(e.target.value))}
          className="w-full" aria-label="半顶角"
        />
        <div className="mt-3 space-y-2">
          {PRESETS.map((q) => (
            <button
              key={q.label}
              onClick={() => onAlpha(q.alpha)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${Math.abs(alpha - q.alpha) < 1e-9 ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <span>{q.label}</span><span className="text-xs opacity-70">{q.note}</span>
            </button>
          ))}
        </div>
      </div>

      <CurveFactsCard
        rows={[
          ['圆锥面残差', maxCone.toExponential(1), '应为 0'],
          ['投影与对数螺线偏差', maxProj.toExponential(1), '应为 0'],
          ['与母线夹角', `${degrees.toFixed(3)}°`, '处处相同'],
          ['夹角极差', angSpread.toExponential(1), '恒定性的度量'],
          ['每圈放大', growthPerTurn(p).toFixed(3), '倍'],
        ]}
        facts={[
          ['等角性', '：与所有母线的夹角恒定，故称圆锥等角螺线。'],
          ['投影是对数螺线', '：压到底面后精确还原成 r₀e^(kt)。'],
          ['半顶角越小锥越尖', '，同半径处高度越大。'],
        ]}
      />
    </div>
  )
}
