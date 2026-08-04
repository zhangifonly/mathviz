/**
 * Dehn 不变量实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  CUBE, SOLIDS, solidOf, rationalMultipleOfPi, dehnIsZero,
  dehnNonzeroWeight, couldBeEquidecomposable, edgeRatioForEqualVolume,
  continuedFraction, nivenNumerator, TIMELINE, type SolidId,
} from './dehnInvariant'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  solidId: SolidId
  showAngles: boolean
  onSolid: (id: SolidId) => void
  onToggleAngles: () => void
}

export default function SidePanel(props: SidePanelProps) {
  const { solidId, showAngles, onSolid, onToggleAngles } = props
  const spec = solidOf(solidId)
  const k = edgeRatioForEqualVolume(CUBE, spec)
  const cmp = couldBeEquidecomposable(CUBE, spec, 1, k)
  const terms = spec.terms(1)
  const cf = continuedFraction(Math.acos(1 / 3) / Math.PI, 8)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择立体</h3>
        <div className="space-y-2">
          {SOLIDS.map((s) => {
            const zero = dehnIsZero(s)
            return (
              <button
                key={s.id}
                onClick={() => onSolid(s.id as SolidId)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${solidId === s.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
              >
                <div className="flex justify-between">
                  <span>{s.label}</span>
                  <span className={`text-xs ${solidId === s.id ? 'opacity-80' : zero ? 'text-green-600' : 'text-red-500'}`}>
                    D {zero ? '= 0' : '≠ 0'}
                  </span>
                </div>
                <div className="text-xs opacity-70 mt-0.5">{s.note}</div>
              </button>
            )
          })}
        </div>
        <button
          onClick={onToggleAngles}
          className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${showAngles ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
        >
          {showAngles ? '✓ 标出二面角' : '标出二面角'}
        </button>
      </div>

      <CurveFactsCard
        title="与立方体能否剪拼"
        rows={[
          ['二面角', terms.map((t) => `${(t.angle * DEG).toFixed(2)}°×${t.count}`).join('，')],
          ...terms.map((t, i) => {
            const r = rationalMultipleOfPi(t.angle)
            return [
              `第 ${i + 1} 类角`,
              r.rational ? `= ${r.p}π/${r.q}` : '与 π 不可通约',
              r.rational ? '贡献 0' : '让 D ≠ 0',
            ] as [string, string, string]
          }),
          ['Dehn 不变量', dehnIsZero(spec) ? '= 0' : '≠ 0'],
          ['非零权重', dehnNonzeroWeight(spec, 1).toFixed(2), '挂在无理角上的棱长'],
          ['等体积棱长', k.toFixed(6), `体积都是 ${CUBE.volume(1).toFixed(3)}`],
          ['能否剪拼', cmp.possible ? '不构成障碍' : '不可能'],
        ]}
        facts={[
          ['Dehn 不变量 = Σ 棱长 ⊗ 二面角', '，在模掉 ℚπ 的空间里取值。'],
          ['二面角是 π 的有理倍数 ⟹ 该项归零', '，立方体因此 D = 0。'],
          ['正四面体的 arccos(1/3) 与 π 不可通约', '，故 D ≠ 0，剪不成立方体。'],
          ['等体积不够', '：希尔伯特第三问题的答案是「不能」，Dehn 1900 年给出。'],
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold mb-2">arccos(1/3)/π 的连分数</h3>
        <div className="text-xs font-mono text-gray-600 break-all">
          [{cf.join(', ')}, …]
        </div>
        <p className="text-xs text-gray-500 mt-1">
          不终止 ⟹ 无理数。对照 π/2 除以 π = 0.5，连分数是 [0, 2]，两项就结束。
        </p>
        <h3 className="text-base font-semibold mb-2 mt-3">Niven 判据</h3>
        <div className="text-xs text-gray-600 space-y-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex justify-between">
              <span>3^{n}·cos({n}θ)</span>
              <span className="font-mono">{nivenNumerator(n)}</span>
              <span className="text-gray-400">
                {nivenNumerator(n) % 3 === 0 ? '被3整除' : '不被3整除'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold mb-2">年表</h3>
        <div className="space-y-1 text-xs">
          {TIMELINE.map((t, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-gray-400 font-mono shrink-0">{t.year}</span>
              <span className="text-gray-600">{t.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
