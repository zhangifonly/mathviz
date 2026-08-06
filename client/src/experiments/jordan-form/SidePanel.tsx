import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  analyze, isDiagonalizable, jordanChain, perturbationSpread,
  type Mat3, type Preset,
} from './jordanForm'

export interface SidePanelProps {
  A: Mat3
  steps: number
  camYaw: number
  camPitch: number
  showChain: boolean
  showOrbits: boolean
  spinning: boolean
  presets: Preset[]
  onA: (A: Mat3) => void
  onSteps: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleChain: () => void
  onToggleOrbits: () => void
  onToggleSpin: () => void
}

const sci = (v: number) => v.toExponential(2).replace('e+0', 'e+').replace('e-0', 'e-')

export default function SidePanel({
  A, steps, camYaw, camPitch, showChain, showOrbits, spinning, presets,
  onA, onSteps, onCamYaw, onCamPitch, onToggleChain, onToggleOrbits, onToggleSpin,
}: SidePanelProps) {
  const info = analyze(A)
  const diag = isDiagonalizable(A)
  const totalGeo = info.reduce((s, e) => s + e.geometric, 0)
  const defective = info.find((e) => e.defective)
  const chainLen = defective && defective.eigenvectors.length
    ? jordanChain(A, defective.value, defective.eigenvectors[0]).length
    : 1

  const rows: Array<[string, string, string?]> = []
  info.forEach((e) => {
    rows.push([
      `λ = ${e.value.toFixed(4)}`,
      `代数 ${e.algebraic} / 几何 ${e.geometric}`,
      e.defective ? '亏损' : '正常',
    ])
  })
  rows.push(['特征方向总数', `${totalGeo} / 3`, totalGeo === 3 ? '够用' : '不够'])
  rows.push(['可对角化', diag ? '可以' : '不可以'])
  if (defective) {
    rows.push(['最大 Jordan 块', String(chainLen), '= Jordan 链长'])
    /*
     * ⚠️ 注释要跟着实测值走, 不能写死。
     * 3×3 块上本课的三次求根器分辨不出 1e−12 的裂开, 实测偏离是 0,
     * 但旧代码仍打出"≈√eps，放大百万倍" —— 数字与说明直接打架。
     * 这里按实际测到的值决定说什么, 测不出来就说测不出来。
     */
    const spread = perturbationSpread(A, 1e-12, chainLen)
    rows.push([
      '扰动 1e−12 后特征值偏离',
      sci(spread),
      spread > 1e-9
        ? `≈ √eps，放大 ${(spread / 1e-12).toExponential(0)} 倍`
        : '本课求根器分辨不出（见讲解）',
    ])
  }

  const facts: Array<[string, string]> = [
    ['对角化的唯一障碍：', '特征向量不够用。几何重数 < 代数重数时叫亏损，凑不出 n 个线性无关的特征向量。'],
    ['两个重数：', '代数重数是特征多项式的根重数；几何重数是 dim ker(A−λI)。总有 1 ≤ 几何 ≤ 代数。'],
    ['补救办法：', '解 (A−λI)v₂ = v₁ 而不是 = 0，得到广义特征向量。这样串起来的链叫 Jordan 链。'],
    ['Jordan 块里的那个 1：', '就是「差一点才能对角化」的量化。链有多长，块就有多大。'],
    ['数值上几乎不可用：', '亏损矩阵在任意小扰动下都会变成可对角化的。2×2 块上，1e−12 的扰动让特征值偏离 1e−6。'],
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
              step={0.1}
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
          把右上角那个 1 改成 0，亏损立刻消失 —— 它就是「差的那一点」。
        </p>

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">轨道步数 = {steps}</label>
          <input
            type="range" min={1} max={30} step={1} value={steps}
            onChange={(ev) => onSteps(Number(ev.target.value))}
            className="w-full accent-indigo-600"
          />
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

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={onToggleChain}
            className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
              showChain ? 'bg-pink-400 text-pink-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showChain ? '✓ ' : ''}广义向量
          </button>
          <button
            onClick={onToggleOrbits}
            className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
              showOrbits ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showOrbits ? '✓ ' : ''}轨道
          </button>
          <button
            onClick={onToggleSpin}
            className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
              spinning ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {spinning ? '⏸ 停止' : '▶ 旋转'}
          </button>
        </div>
      </div>

      <CurveFactsCard title="重数的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">为什么还要学它</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">微分方程</b>：重根时解里会冒出 t·e^{'{λt}'} 这样的项，多出来的 t 正是 Jordan 块的贡献。</li>
          <li><b className="text-gray-800">矩阵函数</b>：算 e^A 时可对角化情形只需对角线取指数，亏损时必须用 Jordan 型。</li>
          <li><b className="text-gray-800">控制论</b>：系统能否解耦成独立模态，取决于状态矩阵可不可对角化。</li>
          <li><b className="text-gray-800">理论价值</b>：Jordan 型是相似变换下的完全不变量——两个矩阵相似当且仅当 Jordan 型相同。</li>
        </ul>
      </div>
    </div>
  )
}
