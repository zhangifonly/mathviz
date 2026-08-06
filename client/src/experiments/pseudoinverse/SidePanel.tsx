import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  add3, norm3, nullSpaceBasis, penroseResiduals, pinv, pinvSolve,
  residual, scale3, svd, type Mat3, type Preset, type Vec3,
} from './pseudoinverse'

export interface SidePanelProps {
  presetId: string
  A: Mat3
  b: Vec3
  nullShift: number
  camYaw: number
  camPitch: number
  panel: 'both' | 'b' | 'x'
  spinning: boolean
  presets: Preset[]
  onPreset: (id: string) => void
  onA: (A: Mat3) => void
  onB: (b: Vec3) => void
  onNullShift: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onPanel: (p: 'both' | 'b' | 'x') => void
  onToggleSpin: () => void
}

const sci = (v: number) => v.toExponential(2).replace('e+0', 'e+').replace('e-0', 'e-')
const PANELS: Array<['both' | 'b' | 'x', string]> = [
  ['both', '并排'],
  ['b', '只看 b'],
  ['x', '只看 x'],
]

export default function SidePanel({
  presetId, A, b, nullShift, camYaw, camPitch, panel, spinning, presets,
  onPreset, onA, onB, onNullShift, onCamYaw, onCamPitch, onPanel, onToggleSpin,
}: SidePanelProps) {
  const { sigma, rank } = svd(A)
  const P = pinv(A)
  const x0 = pinvSolve(A, b)
  const nulls = nullSpaceBasis(A)
  const x = nulls.length > 0 && nullShift !== 0 ? add3(x0, scale3(nulls[0], nullShift)) : x0
  const res = penroseResiduals(A, P)
  const r0 = residual(A, x0, b)

  const rows: Array<[string, string, string?]> = [
    ['秩 / 零空间维数', `${rank} / ${3 - rank}`],
    ['奇异值', sigma.map((s) => s.toExponential(2)).join(', '), 'σ=0 的方向被丢掉'],
    ['x⁺', x0.map((v) => v.toFixed(4)).join(', ')],
    ['|x⁺|', norm3(x0).toFixed(6), '所有最小二乘解里最短'],
    ['残差 |Ax⁺−b|', sci(r0), r0 < 1e-8 ? '相容' : '不相容，已投影'],
    ['四条 Penrose 条件', res.map((v) => sci(v)).join(' '), '都应为 0'],
  ]
  if (nulls.length > 0 && nullShift !== 0) {
    rows.push(['沿零空间挪动后 |x|', norm3(x).toFixed(6), '变长了'])
    rows.push(['挪动后残差', sci(residual(A, x, b)), '完全没变'])
  }

  const facts: Array<[string, string]> = [
    ['伪逆解决什么：', '最小二乘那课只讲了超定且列满秩的情形。欠定、秩亏怎么办？伪逆把四种情形统一起来。'],
    ['一句话定义：', 'x = A⁺b 总是残差最小的解；这样的解若不止一个，它还是其中范数最小的那个。'],
    ['怎么算：', 'A = UΣVᵀ 时 A⁺ = VΣ⁺Uᵀ。Σ⁺ 把非零奇异值取倒数，零仍取零——这是全部关窍。'],
    ['为什么零取零：', '被 A 压扁到零的方向恢复不了，也不该乱猜。取该方向分量为零的解，于是范数最小。'],
    ['两个投影：', 'AA⁺ 是到列空间的正交投影（残差最小的来源），A⁺A 是到行空间的正交投影（范数最小的来源）。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择情形</h3>
        <div className="space-y-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onPreset(p.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center gap-2 ${
                p.id === presetId ? 'bg-indigo-600 text-white font-medium' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="shrink-0">{p.label}</span>
              <span className={`text-xs text-right ${p.id === presetId ? 'text-indigo-100' : 'text-gray-400'}`}>{p.note}</span>
            </button>
          ))}
        </div>

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">矩阵 A</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {A.map((row, i) => row.map((v, j) => (
            <input
              key={`${i}-${j}`}
              type="number" step={0.5} value={v}
              onChange={(ev) => {
                const n = A.map((r) => [...r])
                n[i][j] = Number(ev.target.value)
                onA(n)
              }}
              className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded text-center tabular-nums"
            />
          )))}
        </div>

        <h4 className="text-sm font-semibold text-gray-700 mt-3 mb-2">右端项 b</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {b.map((v, i) => (
            <input
              key={i}
              type="number" step={0.5} value={v}
              onChange={(ev) => {
                const n = [...b] as Vec3
                n[i] = Number(ev.target.value)
                onB(n)
              }}
              className="w-full px-1.5 py-1 text-xs border border-amber-200 bg-amber-50 rounded text-center tabular-nums"
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          把某一行改成另一行的倍数，秩立刻掉下来，零空间就出现了。
        </p>

        {nulls.length > 0 && (
          <div className="mt-3">
            <label className="block text-sm text-gray-700 mb-1">
              沿零空间挪动 = {nullShift.toFixed(2)}
              <span className="text-gray-400 text-xs ml-1">（残差不变，看范数）</span>
            </label>
            <input
              type="range" min={-3} max={3} step={0.05} value={nullShift}
              onChange={(ev) => onNullShift(Number(ev.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        )}

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">显示</h4>
        <div className="grid grid-cols-3 gap-2">
          {PANELS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => onPanel(id)}
              className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                panel === id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

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

        <button
          onClick={onToggleSpin}
          className={`mt-4 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            spinning ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {spinning ? '⏸ 停止旋转' : '▶ 旋转'}
        </button>
      </div>

      <CurveFactsCard title="伪逆的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">四种情形一张表</h3>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li><b className="text-gray-800">满秩方阵</b>：A⁺ = A⁻¹，解唯一。</li>
          <li><b className="text-gray-800">超定、列满秩</b>：A⁺ = (AᵀA)⁻¹Aᵀ，就是最小二乘。</li>
          <li><b className="text-gray-800">欠定、行满秩</b>：A⁺ = Aᵀ(AAᵀ)⁻¹，给最小范数解。</li>
          <li><b className="text-gray-800">秩亏</b>：上面两个公式都失效（要求逆的矩阵奇异），只有 SVD 版本还管用。</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          所以实际计算伪逆一律走 SVD，而不是套公式——正规方程还会把条件数平方。
        </p>
      </div>
    </div>
  )
}
