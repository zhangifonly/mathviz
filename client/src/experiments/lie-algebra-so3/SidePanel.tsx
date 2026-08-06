import CurveFactsCard from '../../lib/CurveFactsCard'
import type { Mode } from './draw'
import {
  bchDefect, bchSecondOrderDefect, cross, det3, expSeries, expSO3, hat,
  logSO3, matMaxDiff, norm3, orthogonalityResidual, skewResidual,
  type Preset, type Vec3,
} from './lieAlgebraSO3'

export interface SidePanelProps {
  omega: Vec3
  t: number
  mode: Mode
  terms: number
  camYaw: number
  camPitch: number
  playing: boolean
  presets: Preset[]
  onOmega: (v: Vec3) => void
  onT: (v: number) => void
  onMode: (m: Mode) => void
  onTerms: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onTogglePlay: () => void
}

const MODES: Array<[Mode, string]> = [
  ['exp', '指数映射'],
  ['series', '闭式 vs 级数'],
  ['bracket', '李括号'],
]
const AXES: Array<[number, string]> = [[0, 'ωx'], [1, 'ωy'], [2, 'ωz']]
const sci = (v: number) => v.toExponential(2).replace('e+0', 'e+').replace('e-0', 'e-')

export default function SidePanel({
  omega, t, mode, terms, camYaw, camPitch, playing, presets,
  onOmega, onT, onMode, onTerms, onCamYaw, onCamPitch, onTogglePlay,
}: SidePanelProps) {
  const wt: Vec3 = [omega[0] * t, omega[1] * t, omega[2] * t]
  const theta = norm3(wt)
  const R = expSO3(wt)
  const back = logSO3(R)
  const roundTrip = Math.max(...back.map((v, i) => Math.abs(v - wt[i])))
  const b: Vec3 = [omega[2], omega[0], omega[1]]

  const rows: Array<[string, string, string?]> = [
    ['θ = |tω|', `${theta.toFixed(6)}`, `${((theta * 180) / Math.PI).toFixed(2)}°`],
    ['[ω]× 反对称偏差', sci(skewResidual(hat(omega))), '应为 0'],
    ['exp 后正交偏差', sci(orthogonalityResidual(R)), '应为 0'],
    ['det(R)', det3(R).toFixed(10), '应为 1'],
    ['log(exp(ω)) 往返误差', sci(roundTrip), '应为 0'],
  ]

  if (mode === 'series') {
    rows.push(
      [`级数 ${terms} 项与闭式的差`, sci(matMaxDiff(R, expSeries(wt, terms))), '项数够就趋于 0'],
      ['级数 40 项与闭式的差', sci(matMaxDiff(R, expSeries(wt, 40))), '闭式是精确求和'],
    )
  } else {
    rows.push(
      ['[ω, b] = ω×b', cross(omega, b).map((v) => v.toFixed(3)).join(', '), '李括号'],
      ['exp(A)exp(B) − exp(A+B)', sci(bchDefect(omega, b)), '非零即不可交换'],
      ['加上 ½[A,B] 后的差', sci(bchSecondOrderDefect(omega, b)), '明显更小'],
    )
  }

  const facts: Array<[string, string]> = [
    ['so(3) = 反对称矩阵：', '由 RᵀR = I 求导得 R′(0)ᵀ + R′(0) = 0，所以切空间就是反对称矩阵。'],
    ['hat 映射把叉积变成矩阵乘法：', '[ω]× v = ω × v，三个自由参数恰好装成一个向量。'],
    ['Rodrigues 是精确求和，不是近似：', 'K³ = −K，级数每三项折回，奇次幂攒成 sin、偶次幂攒成 1−cos。'],
    ['李括号度量不可交换：', '[A,B] = AB − BA 在 so(3) 上就是叉积；括号非零，旋转就不能换序。'],
    ['exp 不是处处可加：', 'exp(A)exp(B) = exp(A+B) 只在同轴时成立，一般差一个 ½[A,B]（BCH）。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择 ω</h3>
        <div className="space-y-1.5">
          {presets.map((p) => {
            const active = p.omega.every((v, i) => Math.abs(v - omega[i]) < 1e-9)
            return (
              <button
                key={p.id}
                onClick={() => onOmega([...p.omega] as Vec3)}
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

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">显示模式</h4>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(([id, label]) => (
            <button
              key={id}
              onClick={() => onMode(id)}
              className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                mode === id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {AXES.map(([i, name]) => (
          <div className="mt-3" key={name}>
            <label className="block text-sm text-gray-700 mb-1">
              {name} = {omega[i].toFixed(2)}
            </label>
            <input
              type="range" min={-2} max={2} step={0.01} value={omega[i]}
              onChange={(ev) => {
                const n = [...omega] as Vec3
                n[i] = Number(ev.target.value)
                onOmega(n)
              }}
              className="w-full accent-indigo-600"
            />
          </div>
        ))}

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">t = {t.toFixed(3)}</label>
          <input
            type="range" min={0} max={3} step={0.001} value={t}
            onChange={(ev) => onT(Number(ev.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        {mode === 'series' && (
          <div className="mt-3">
            <label className="block text-sm text-gray-700 mb-1">
              级数项数 = {terms}
              <span className="text-gray-400 text-xs ml-1">（少了就不再是旋转）</span>
            </label>
            <input
              type="range" min={1} max={20} step={1} value={terms}
              onChange={(ev) => onTerms(Number(ev.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角水平 {(camYaw * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0} max={Math.PI * 2} step={0.01} value={camYaw}
              onChange={(ev) => onCamYaw(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角俯仰 {(camPitch * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={-1.2} max={1.2} step={0.01} value={camPitch}
              onChange={(ev) => onCamPitch(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <button
          onClick={onTogglePlay}
          className={`mt-4 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            playing ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {playing ? '⏸ 暂停' : '▶ 播放 t'}
        </button>
      </div>

      <CurveFactsCard title="指数映射的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">这套机器用在哪</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">机器人学</b>：关节的旋量表示与正运动学，指数积公式（PoE）。</li>
          <li><b className="text-gray-800">SLAM 与位姿优化</b>：在 so(3) 上做增量、再 exp 回群，避免直接优化带约束的矩阵。</li>
          <li><b className="text-gray-800">刚体动力学</b>：角速度天然住在 so(3) 里，ω 就是切空间的元素。</li>
          <li><b className="text-gray-800">量子力学</b>：同一套结构给出 su(2)，与 so(3) 的关系正是前一课的双重覆盖。</li>
        </ul>
      </div>
    </div>
  )
}
