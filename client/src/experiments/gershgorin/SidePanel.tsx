import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  componentCounts, eigenvalues, gershgorinBound, isStrictlyDiagonallyDominant,
  rowDiscs, spectralRadius, type Mat3, type Preset,
} from './gershgorin'

export interface SidePanelProps {
  A: Mat3
  camYaw: number
  camPitch: number
  showCols: boolean
  showComponents: boolean
  spinning: boolean
  presets: Preset[]
  onA: (A: Mat3) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleCols: () => void
  onToggleComponents: () => void
  onToggleSpin: () => void
}

export default function SidePanel({
  A, camYaw, camPitch, showCols, showComponents, spinning, presets,
  onA, onCamYaw, onCamPitch, onToggleCols, onToggleComponents, onToggleSpin,
}: SidePanelProps) {
  const discs = rowDiscs(A)
  const eigs = eigenvalues(A)
  const comps = componentCounts(A, discs)
  const rho = spectralRadius(A)
  const bound = gershgorinBound(A)
  const dominant = isStrictlyDiagonallyDominant(A)
  const hasComplex = eigs.some((z) => Math.abs(z.im) > 1e-8)

  const rows: Array<[string, string, string?]> = []
  discs.forEach((d) => {
    rows.push([`盘 ${d.index + 1}`, `|z − ${d.center.toFixed(2)}| ≤ ${d.radius.toFixed(3)}`])
  })
  rows.push([
    '特征值',
    eigs.map((z) => (Math.abs(z.im) < 1e-8
      ? z.re.toFixed(3)
      : `${z.re.toFixed(2)}${z.im > 0 ? '+' : '−'}${Math.abs(z.im).toFixed(2)}i`)).join(', '),
    hasComplex ? '含复根' : '全实',
  ])
  comps.forEach((c, i) => {
    rows.push([
      `分量 ${i + 1}`,
      `${c.discCount} 盘 / ${c.eigCount} 值`,
      c.discCount === c.eigCount ? '恰好相等' : '异常',
    ])
  })
  rows.push(['谱半径 ρ(A)', rho.toFixed(6)])
  rows.push(['Gershgorin 上界', bound.toFixed(6), `松了 ${(bound - rho).toFixed(4)}`])
  rows.push(['严格对角占优', dominant ? '是' : '否', dominant ? '⇒ 必可逆' : ''])

  const facts: Array<[string, string]> = [
    ['定理：', '每个特征值至少落在一个圆盘里。圆心是对角元 aᵢᵢ，半径是该行其余元素绝对值之和。'],
    ['证明只要三行：', '取特征向量里模最大的分量 xᵢ，由第 i 行方程移项、除以 xᵢ 再取模，立刻得到 |λ − aᵢᵢ| ≤ Rᵢ。'],
    ['加强版：', 'k 个圆盘连成一片且与其余不相交时，那一片里恰好有 k 个特征值。这才能把特征值一个个隔离。'],
    ['行列都能用：', '对 Aᵀ 再来一遍得到列圆盘，特征值同样落在里面。取两组的交更紧。'],
    ['推论：', '严格对角占优（每行 |aᵢᵢ| > Rᵢ）时所有圆盘都不含原点，所以 0 不是特征值，矩阵必可逆。'],
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
              step={0.5}
              value={v}
              onChange={(ev) => {
                const n = A.map((r) => [...r])
                n[i][j] = Number(ev.target.value)
                onA(n)
              }}
              className={`w-full px-1.5 py-1 text-xs border rounded text-center tabular-nums ${
                i === j ? 'border-indigo-300 bg-indigo-50 font-semibold' : 'border-gray-200'
              }`}
            />
          )))}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          蓝底是对角元（圆心）。把非对角元调小，圆盘就缩紧，估计立刻变准。
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角水平 {(camYaw * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0} max={Math.PI * 2} step={0.01} value={camYaw % (Math.PI * 2)}
              onChange={(ev) => onCamYaw(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角俯仰 {(camPitch * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0.1} max={1.5} step={0.01} value={camPitch}
              onChange={(ev) => onCamPitch(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={onToggleCols}
            className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
              showCols ? 'bg-violet-400 text-violet-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showCols ? '✓ ' : ''}列圆盘
          </button>
          <button
            onClick={onToggleComponents}
            className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
              showComponents ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showComponents ? '✓ ' : ''}分量配色
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

      <CurveFactsCard title="圆盘的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">它有什么用</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">一眼判可逆</b>：不用算行列式，看每行对角元是否压过其余之和。</li>
          <li><b className="text-gray-800">迭代法收敛性</b>：Jacobi、Gauss-Seidel 迭代收敛的经典充分条件就是严格对角占优。</li>
          <li><b className="text-gray-800">稳定性判据</b>：所有圆盘落在左半平面 ⇒ 所有特征值实部为负 ⇒ 系统稳定。</li>
          <li><b className="text-gray-800">给迭代法定起点</b>：圆盘给出谱半径上界，可用来选位移量或缩放因子。</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          它的价值不在精确，而在<b>不用算就能说</b>。非对角元越小，圆盘越紧，估计越接近真值。
        </p>
      </div>
    </div>
  )
}
