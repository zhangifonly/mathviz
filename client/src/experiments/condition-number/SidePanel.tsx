import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  conditionNumber, det3, perturbationTest, singularValues,
  worstDirection, worstRHS, type Mat3, type Preset,
} from './conditionNumber'

export interface SidePanelProps {
  A: Mat3
  camYaw: number
  camPitch: number
  showWorst: boolean
  spinning: boolean
  presets: Preset[]
  onA: (A: Mat3) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleWorst: () => void
  onToggleSpin: () => void
}

const sci = (v: number) => (Number.isFinite(v) ? v.toExponential(3) : '∞')

export default function SidePanel({
  A, camYaw, camPitch, showWorst, spinning, presets,
  onA, onCamYaw, onCamPitch, onToggleWorst, onToggleSpin,
}: SidePanelProps) {
  const sig = singularValues(A)
  const kappa = conditionNumber(A)
  const p6 = perturbationTest(A, worstRHS(A), worstDirection(A), 1e-6)
  const digitsLost = Number.isFinite(kappa) ? Math.log10(kappa) : Infinity

  const rows: Array<[string, string, string?]> = [
    ['σ₁ / σ₂ / σ₃', sig.map((v) => v.toExponential(2)).join(' / ')],
    ['κ = σ₁/σ₃', sci(kappa), '误差放大的上界'],
    ['det(A)', sci(det3(A)), '= σ₁σ₂σ₃，与 κ 无关'],
    ['大约丢失的有效位数', Number.isFinite(digitsLost) ? digitsLost.toFixed(2) : '全部', 'log₁₀κ'],
    ['输入相对误差 1e−6', p6 ? sci(p6.amplification * 1e-6) : '—', '解的相对误差'],
    ['双精度还剩几位', Number.isFinite(digitsLost) ? Math.max(0, 16 - digitsLost).toFixed(1) : '0', '16 − log₁₀κ'],
  ]

  const facts: Array<[string, string]> = [
    ['条件数是什么：', 'κ(A)=‖A‖·‖A⁻¹‖。用 2-范数时 κ = σ₁/σ₃，即最大奇异值比最小奇异值。'],
    ['几何图像：', 'A 把单位球映成椭球，三条半轴长就是三个奇异值。κ 就是椭球有多扁。'],
    ['为什么扁就危险：', '被压扁的方向上信息几乎丢光，反解时就要把误差放大回去，放大倍数最大正是 κ。'],
    ['行列式小 ≠ 病态：', 'det 是奇异值之积，κ 是最大与最小之比。0.001·I 的 det 是 1e−9，但 κ=1，完美良态。'],
    ['经验法则：', '双精度约 16 位有效数字，κ=10ᵏ 时大约丢掉 k 位。κ 到 1e16 就一位都不剩了。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择矩阵</h3>
        <div className="space-y-1.5">
          {presets.map((p) => {
            const active = p.A.every((row, i) => row.every((v, j) => Math.abs(v - A[i][j]) < 1e-12))
            return (
              <button
                key={p.id}
                onClick={() => onA(p.A.map((r) => [...r]))}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center gap-2 ${
                  active ? 'bg-indigo-600 text-white font-medium' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="shrink-0">{p.label}</span>
                <span className={`text-xs text-right ${active ? 'text-indigo-100' : 'text-gray-400'}`}>{p.note}</span>
              </button>
            )
          })}
        </div>

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">直接编辑 A</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {A.map((row, i) => row.map((v, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              step={0.001}
              value={v}
              onChange={(ev) => {
                const n = A.map((r) => [...r])
                n[i][j] = Number(ev.target.value)
                onA(n)
              }}
              className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded text-center tabular-nums"
            />
          )))}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          试试把第二行改得和第一行几乎一样 —— κ 会立刻飙上去。
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角水平 {(camYaw * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0} max={Math.PI * 2} step={0.01} value={camYaw % (Math.PI * 2)}
              onChange={(ev) => onCamYaw(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角俯仰 {(camPitch * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={-1.2} max={1.2} step={0.01} value={camPitch}
              onChange={(ev) => onCamPitch(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onToggleWorst}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showWorst ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showWorst ? '✓ ' : ''}最坏方向
          </button>
          <button
            onClick={onToggleSpin}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              spinning ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {spinning ? '⏸ 停止' : '▶ 旋转'}
          </button>
        </div>
      </div>

      <CurveFactsCard title="条件数的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">κ 的量级对照</h3>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li><b className="text-emerald-600">κ ≈ 1</b>：正交矩阵、单位阵。误差不放大。</li>
          <li><b className="text-emerald-600">κ &lt; 10</b>：良态，随便算。</li>
          <li><b className="text-amber-600">κ ≈ 10³</b>：丢 3 位有效数字，一般还能接受。</li>
          <li><b className="text-rose-600">κ ≈ 10⁸</b>：单精度已全废，双精度只剩一半。</li>
          <li><b className="text-rose-600">κ &gt; 10¹⁶</b>：双精度下解完全不可信，需换算法或重新建模。</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          著名的病态例子是 Hilbert 矩阵：n=6 时 κ 已超过 10⁷，n=10 时超过 10¹³。
        </p>
      </div>
    </div>
  )
}
