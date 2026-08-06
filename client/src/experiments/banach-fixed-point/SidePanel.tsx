import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  aPosterioriBound, aPrioriBound, errorSequence, fixedPoint, isContraction,
  spectralNorm, spectralRadius, stepsNeeded,
  type Mat2, type Preset, type Vec2,
} from './banachFixedPoint'

export interface SidePanelProps {
  presetId: string
  A: Mat2
  b: Vec2
  x0: Vec2
  steps: number
  camYaw: number
  camPitch: number
  showCone: boolean
  spinning: boolean
  presets: Preset[]
  onPreset: (id: string) => void
  onA: (A: Mat2) => void
  onB: (b: Vec2) => void
  onX0: (x: Vec2) => void
  onSteps: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleCone: () => void
  onToggleSpin: () => void
}

const f = (v: number) => (Number.isFinite(v) ? v.toExponential(3) : '∞')

export default function SidePanel({
  presetId, A, b, x0, steps, camYaw, camPitch, showCone, spinning, presets,
  onPreset, onA, onB, onX0, onSteps, onCamYaw, onCamPitch, onToggleCone, onToggleSpin,
}: SidePanelProps) {
  const q = spectralNorm(A)
  const rho = spectralRadius(A)
  const star = fixedPoint(A, b)
  const errs = errorSequence(A, b, x0, steps)
  const n = Math.min(10, Math.max(0, errs.length - 1))

  const rows: Array<[string, string, string?]> = [
    ['谱范数 ‖A‖₂', q.toFixed(6), isContraction(A) ? '<1，是压缩' : '≥1，不是压缩'],
    ['谱半径 ρ(A)', rho.toFixed(6), rho < 1 ? '<1，收敛' : '≥1，发散'],
    ['不动点 x*', star ? star.map((v) => v.toFixed(4)).join(', ') : '不存在'],
    [`n=${n} 实际误差`, errs.length > n ? f(errs[n]) : '—'],
    ['先验界', f(aPrioriBound(A, b, x0, n)), '只用第一步就能算'],
    ['后验界', f(aPosterioriBound(A, b, x0, n)), '更紧，但要先迭代'],
    ['达到 1e−6 需迭代', stepsNeeded(A, b, x0, 1e-6) === null ? '定理不适用' : `${stepsNeeded(A, b, x0, 1e-6)} 步`],
  ]

  const facts: Array<[string, string]> = [
    ['定理一次给三样东西：', '不动点存在、唯一、且任何初值都收敛到它。项目里「不动点迭代」那课默认存在性，只讨论了收不收敛。'],
    ['先验误差界最实用：', 'd(xₙ,x*) ≤ qⁿ/(1−q)·d(x₁,x₀)。只要量出第一步走多远，就能事先算出「迭代多少次够用」，不必真跑完。'],
    ['后验界更紧：', 'd(xₙ,x*) ≤ q/(1−q)·d(xₙ,xₙ₋₁)。实测弱压缩时先验给 80.5，后验只有 15.4——但它必须先迭代到第 n 步。'],
    ['压缩是充分不必要：', '剪切阵 [[0.5,3],[0,0.5]] 的 ‖A‖=3.08 不满足条件，但 ρ=0.5，实测 60 步后误差精确为 0。'],
    ['收敛由谱半径决定：', '线性映射看 ρ(A) 而不是 ‖A‖。ρ≥1 才真的发散——那时不动点仍然存在，只是不吸引。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择映射</h3>
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
        <div className="grid grid-cols-2 gap-1.5">
          {A.map((row, i) => row.map((v, j) => (
            <input
              key={`${i}-${j}`}
              type="number" step={0.1} value={v}
              onChange={(e) => {
                const nA = A.map((r) => [...r]) as Mat2
                nA[i][j] = Number(e.target.value)
                onA(nA)
              }}
              className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded text-center tabular-nums"
            />
          )))}
        </div>

        <h4 className="text-sm font-semibold text-gray-700 mt-3 mb-2">平移 b 与初值 x₀</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {b.map((v, i) => (
            <input
              key={`b${i}`} type="number" step={0.5} value={v}
              onChange={(e) => {
                const nb = [...b] as Vec2
                nb[i] = Number(e.target.value)
                onB(nb)
              }}
              className="w-full px-1.5 py-1 text-xs border border-amber-200 bg-amber-50 rounded text-center tabular-nums"
            />
          ))}
          {x0.map((v, i) => (
            <input
              key={`x${i}`} type="number" step={0.5} value={v}
              onChange={(e) => {
                const nx = [...x0] as Vec2
                nx[i] = Number(e.target.value)
                onX0(nx)
              }}
              className="w-full px-1.5 py-1 text-xs border border-sky-200 bg-sky-50 rounded text-center tabular-nums"
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          黄色是 b，蓝色是初值。换初值试试——收敛点不会变，这就是唯一性。
        </p>

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">迭代步数 = {steps}</label>
          <input
            type="range" min={2} max={60} step={1} value={steps}
            onChange={(e) => onSteps(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角水平 {(camYaw * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0} max={Math.PI * 2} step={0.01} value={camYaw % (Math.PI * 2)}
              onChange={(e) => onCamYaw(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角俯仰 {(camPitch * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={-0.2} max={1.2} step={0.01} value={camPitch}
              onChange={(e) => onCamPitch(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onToggleCone}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showCone ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showCone ? '✓ ' : ''}误差包络
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

      <CurveFactsCard title="收敛的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">定理用在哪里</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">微分方程解的存在唯一性</b>：Picard 迭代把初值问题化成积分算子的不动点，压缩性给出局部解的存在唯一。</li>
          <li><b className="text-gray-800">数值求解</b>：Jacobi、Gauss-Seidel 迭代收敛的判据，以及「要迭代多少次」的事先估计。</li>
          <li><b className="text-gray-800">隐函数定理</b>：标准证明就是构造一个压缩映射。</li>
          <li><b className="text-gray-800">分形</b>：迭代函数系统的吸引子，正是压缩映射族在「紧集空间」上的唯一不动点。</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          注意定理要求空间<b>完备</b>。在有理数上取 x ↦ (x+2/x)/2，它是压缩的，
          但不动点 √2 不在有理数里——迭代收敛不到任何有理点。
        </p>
      </div>
    </div>
  )
}
