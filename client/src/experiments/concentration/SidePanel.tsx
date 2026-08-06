import CurveFactsCard from '../../lib/CurveFactsCard'
import { allBounds, crossoverN, sampleSize, type Preset } from './concentration'

export interface SidePanelProps {
  presetId: string
  t: number
  nMax: number
  p: number
  camYaw: number
  camPitch: number
  show: [boolean, boolean, boolean]
  spinning: boolean
  presets: Preset[]
  onPreset: (id: string) => void
  onT: (v: number) => void
  onNMax: (v: number) => void
  onP: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleShow: (i: number) => void
  onToggleSpin: () => void
}

const NAMES = ['真实尾概率', 'Chebyshev', 'Hoeffding']
const DOTS = ['bg-emerald-400', 'bg-amber-400', 'bg-sky-400']

export default function SidePanel({
  presetId, t, nMax, p, camYaw, camPitch, show, spinning, presets,
  onPreset, onT, onNMax, onP, onCamYaw, onCamPitch, onToggleShow, onToggleSpin,
}: SidePanelProps) {
  const setup = { p, a: 0, b: 1 }
  const nHere = Math.round(nMax / 2)
  const b = allBounds(nHere, t, setup)
  const cross = crossoverN(t, setup)
  const ss = sampleSize(t, 0.05, setup)

  const rows: Array<[string, string, string?]> = [
    [`n = ${nHere} 处真实概率`, b.exact.toExponential(4)],
    ['Chebyshev', b.chebyshev.toExponential(4), b.chebyshev < b.hoeffding ? '更紧' : ''],
    ['Hoeffding', b.hoeffding.toExponential(4), b.hoeffding < b.chebyshev ? '更紧' : ''],
    ['交叉点 n', cross === null ? '不交叉' : cross.toFixed(1), '过了它 Hoeffding 才领先'],
    ['要 95% 把握需要 n', String(ss.exact ?? '—'), '真实所需'],
    ['Hoeffding 要求', String(ss.hoeffding), `多要 ${ss.exact ? (ss.hoeffding / ss.exact).toFixed(1) : '—'} 倍`],
    ['Chebyshev 要求', String(ss.chebyshev), `多要 ${ss.exact ? (ss.chebyshev / ss.exact).toFixed(1) : '—'} 倍`],
  ]

  const facts: Array<[string, string]> = [
    ['大数定律只说会收敛：', '这门课回答两个更要紧的问题——偏离超过 t 的概率有多大？要多少样本才有 95% 的把握？'],
    ['三个界层层收紧：', 'Markov 只要 X≥0；Chebyshev 还要知道方差；Hoeffding 还要求有界。假设越多，界越紧。'],
    ['Markov 是另外两个的来源：', 'Chebyshev 是把 Markov 用在 (X−μ)² 上，Hoeffding 是用在 e^(λX) 上。'],
    ['衰减形状不同：', 'Chebyshev 是 σ²/(nt²)，随 n 线性衰减；Hoeffding 是 2e^(−2nt²)，指数衰减。'],
    ['但指数不总是更紧：', 'n 小的时候 Chebyshev 反而更紧。交叉点随 t 变小而右移：t=0.3 时约 12，t=0.1 时约 108。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择容差</h3>
        <div className="space-y-1.5">
          {presets.map((pr) => (
            <button
              key={pr.id}
              onClick={() => onPreset(pr.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center gap-2 ${
                pr.id === presetId ? 'bg-indigo-600 text-white font-medium' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="shrink-0">{pr.label}</span>
              <span className={`text-xs text-right ${pr.id === presetId ? 'text-indigo-100' : 'text-gray-400'}`}>{pr.note}</span>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-1">容差 t = {t.toFixed(3)}</label>
          <input
            type="range" min={0.04} max={0.32} step={0.005} value={t}
            onChange={(e) => onT(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">n 轴上界 = {nMax}</label>
          <input
            type="range" min={20} max={1200} step={10} value={nMax}
            onChange={(e) => onNMax(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">
            伯努利 p = {p.toFixed(2)}
            <span className="text-gray-400 text-xs ml-1">（p=0.5 方差最大）</span>
          </label>
          <input
            type="range" min={0.05} max={0.95} step={0.01} value={p}
            onChange={(e) => onP(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">显示曲面</h4>
        <div className="space-y-1.5">
          {NAMES.map((name, i) => (
            <button
              key={name}
              onClick={() => onToggleShow(i)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                show[i] ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-400'
              }`}
            >
              <span className={`w-4 h-2.5 rounded ${DOTS[i]} ${show[i] ? '' : 'opacity-30'}`} />
              {show[i] ? '✓ ' : ''}{name}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角水平 {(camYaw * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0} max={Math.PI * 2} step={0.01} value={camYaw % (Math.PI * 2)}
              onChange={(e) => onCamYaw(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角俯仰 {(camPitch * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0.1} max={1.2} step={0.01} value={camPitch}
              onChange={(e) => onCamPitch(Number(e.target.value))} className="w-full accent-indigo-600" />
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

      <CurveFactsCard title="界的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">为什么还用宽松的界</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">不需要知道分布</b>：Hoeffding 只要求有界，对任何分布都成立。真实概率得先知道分布才算得出。</li>
          <li><b className="text-gray-800">能反解样本量</b>：给定精度和把握，直接解出 n，这是做实验设计时唯一能用的东西。</li>
          <li><b className="text-gray-800">推广性强</b>：Hoeffding 可推广到鞅（Azuma）、到矩阵（Matrix Chernoff），真实概率没有这种推广。</li>
          <li><b className="text-gray-800">机器学习的基石</b>：泛化误差界、PAC 学习、多臂老虎机的置信区间，全都建立在这类不等式上。</li>
        </ul>
      </div>
    </div>
  )
}
