/**
 * Dandelin 双球实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  PRESETS, presetOf, dandelinSpheres, focalSum, focalSumSpread,
  generatrixSegment, tangentLengthGap, semiMajor, semiMinor,
  focalHalfDistance, eccentricity, eccentricityAnalytic, isEllipse,
  PROOF_STEPS, type PresetId,
} from './dandelin'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  presetId: PresetId
  theta: number
  phi: number
  showProof: boolean
  showSpheres: boolean
  onPreset: (id: PresetId) => void
  onTheta: (v: number) => void
  onPhi: (v: number) => void
  onToggleProof: () => void
  onToggleSpheres: () => void
}

export default function SidePanel(props: SidePanelProps) {
  const {
    presetId, theta, phi, showProof, showSpheres,
    onPreset, onTheta, onPhi, onToggleProof, onToggleSpheres,
  } = props
  const base = presetOf(presetId)
  const cut = { ...base, theta }
  const ok = isEllipse(cut)
  const maxTheta = Math.PI / 2 - cut.alpha

  const rows: Array<[string, string, string?]> = ok
    ? [
      ['PF₁ + PF₂', focalSum(cut, phi).toFixed(8)],
      ['T₁T₂（母线截段）', generatrixSegment(cut).toFixed(8), '两者相等'],
      ['全曲线极差', focalSumSpread(cut, 240).toExponential(2), '应为 0'],
      ['|PF₁ − PT₁|', tangentLengthGap(cut, phi, true).toExponential(2), '切线段等长'],
      ['|PF₂ − PT₂|', tangentLengthGap(cut, phi, false).toExponential(2)],
      ['上球半径', dandelinSpheres(cut)[0].radius.toFixed(5)],
      ['下球半径', dandelinSpheres(cut)[1].radius.toFixed(5)],
      ['长半轴 a', semiMajor(cut).toFixed(6)],
      ['短半轴 b', semiMinor(cut).toFixed(6)],
      ['半焦距 c', focalHalfDistance(cut).toFixed(6)],
      ['a² − b² − c²', (semiMajor(cut) ** 2 - semiMinor(cut) ** 2
        - focalHalfDistance(cut) ** 2).toExponential(2), '应为 0'],
      ['离心率 e', eccentricity(cut).toFixed(8)],
      ['解析 sinθ/cosα', eccentricityAnalytic(cut).toFixed(8), '与 e 一致'],
    ]
    : [['状态', '倾角过大', '切口不是椭圆']]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择配置</h3>
        <div className="space-y-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onPreset(p.id)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${presetId === p.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div className="flex justify-between">
                <span>{p.label}</span>
                <span className="text-xs opacity-70">
                  α={(p.alpha * DEG).toFixed(0)}°
                </span>
              </div>
            </button>
          ))}
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          切平面倾角 θ = {(theta * DEG).toFixed(1)}°
          <span className="text-xs text-gray-400 ml-1">
            （上限 {(maxTheta * DEG).toFixed(1)}°）
          </span>
        </label>
        <input
          type="range" min={0} max={Math.PI / 2 - 0.05} step={0.01} value={theta}
          onChange={(e) => onTheta(Number(e.target.value))}
          className="w-full mt-1"
        />

        <label className="block mt-3 text-sm font-medium text-gray-700">
          母线方位角 φ = {(phi * DEG).toFixed(0)}°
        </label>
        <input
          type="range" min={0} max={2 * Math.PI} step={0.02} value={phi}
          onChange={(e) => onPhi(Number(e.target.value))}
          className="w-full mt-1"
        />

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={onToggleProof}
            className={`px-2 py-2 rounded-lg text-xs font-medium ${showProof ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
          >
            {showProof ? '✓ 证明线段' : '证明线段'}
          </button>
          <button
            onClick={onToggleSpheres}
            className={`px-2 py-2 rounded-lg text-xs font-medium ${showSpheres ? 'bg-blue-400 text-blue-900' : 'bg-gray-100 text-gray-600'}`}
          >
            {showSpheres ? '✓ 双球' : '双球'}
          </button>
        </div>
      </div>

      <CurveFactsCard
        title="证明的读数"
        rows={rows}
        facts={[
          ['从锥外一点到球的切线段等长', '，长度 √(|PO|² − r²) 只依赖点到球心的距离。'],
          ['PF₁ = PT₁ 且 PF₂ = PT₂', '，因为都是从 P 出发到同一个球的切线段。'],
          ['于是 PF₁ + PF₂ = T₁T₂', '，而这段母线长对每条母线都一样。'],
          ['距离之和恒定 ⟹ 切口是椭圆', '，两球与平面的切点就是焦点。'],
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold mb-2">证明三步</h3>
        <div className="space-y-2 text-xs">
          {PROOF_STEPS.map((s) => (
            <div key={s.step}>
              <div className="font-medium text-gray-700">
                {s.step}. {s.claim}
              </div>
              <div className="text-gray-500 mt-0.5">{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
