import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  cAbs, classify, eigenvaluesByModulus, limitSpread, perronVector,
  type Mat3, type Preset,
} from './perronFrobenius'

export interface SidePanelProps {
  presetId: string
  A: Mat3
  damping: number
  steps: number
  camYaw: number
  camPitch: number
  panel: 'both' | 'simplex' | 'spectrum'
  spinning: boolean
  presets: Preset[]
  onPreset: (id: string) => void
  onDamping: (v: number) => void
  onSteps: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onPanel: (p: 'both' | 'simplex' | 'spectrum') => void
  onToggleSpin: () => void
}

const PANELS: Array<['both' | 'simplex' | 'spectrum', string]> = [
  ['both', '并排'],
  ['simplex', '单纯形'],
  ['spectrum', '特征值'],
]

export default function SidePanel({
  presetId, A, damping, steps, camYaw, camPitch, panel, spinning, presets,
  onPreset, onDamping, onSteps, onCamYaw, onCamPitch, onPanel, onToggleSpin,
}: SidePanelProps) {
  const c = classify(A)
  const ev = eigenvaluesByModulus(A)
  const pv = perronVector(A)
  const spread = limitSpread(A)

  const rows: Array<[string, string, string?]> = [
    ['不可约（强连通）', c.irreducible ? '是' : '否'],
    ['本原（某幂全正）', c.primitive ? `是（A^${c.primitiveAt}）` : '否'],
    ['|λ₁| / |λ₂| / |λ₃|', ev.map((z) => cAbs(z).toFixed(4)).join(' / ')],
    ['谱隙', c.gap.toFixed(6), c.gap > 1e-8 ? '> 0，会收敛' : '= 0，不收敛'],
    ['收敛率 |λ₂|/|λ₁|', c.rate.toFixed(6), '每步误差乘这个数'],
    ['迭代是否收敛', pv.converged ? '是' : '否'],
    ['三个初值的终点差异', spread.toFixed(6), spread < 1e-6 ? '殊途同归' : '各去各的'],
    ['稳态', pv.converged ? pv.vector.map((v) => v.toFixed(4)).join(', ') : '不存在（打转）'],
  ]

  const facts: Array<[string, string]> = [
    ['定理（本原情形）：', '非负方阵若某个幂处处为正，则有唯一的最大实特征值 r>0，对应特征向量处处为正，任何非负初值都收敛到它。'],
    ['关键量是谱隙：', '|λ₁|−|λ₂|。大于零才收敛，收敛率就是 |λ₂|/|λ₁| —— 每迭代一次，偏离稳态的成分乘一次这个数。'],
    ['失败模式一：周期', '循环置换的三个特征值全在单位圆上，谱隙为 0。不可约但不本原，迭代永远打转。'],
    ['失败模式二：可约', '分块三角矩阵有两个闭合子链，特征值 1 是重根。迭代收敛，但收敛到哪取决于初值。'],
    ['两种失败要两个检测：', '可约情形迭代本身是收敛的，只有换初值才暴露；周期情形则是迭代根本不停。缺一不可。'],
    ['PageRank 的 0.85：', '阻尼把矩阵强行变正，两种失败一起消除，且收敛率有了与图结构无关的上界 d。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择矩阵</h3>
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

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-1">
            PageRank 阻尼 d = {damping.toFixed(2)}
            <span className="text-gray-400 text-xs ml-1">（1 = 不加阻尼）</span>
          </label>
          <input
            type="range" min={0.3} max={1} step={0.01} value={damping}
            onChange={(ev2) => onDamping(Number(ev2.target.value))}
            className="w-full accent-indigo-600"
          />
          <p className="text-xs text-gray-400 mt-1">
            拖到 1 以下，周期和可约两种失败会一起消失。
          </p>
        </div>

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">迭代步数 = {steps}</label>
          <input
            type="range" min={2} max={60} step={1} value={steps}
            onChange={(ev2) => onSteps(Number(ev2.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

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
              onChange={(ev2) => onCamYaw(Number(ev2.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角俯仰 {(camPitch * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0.1} max={1.4} step={0.01} value={camPitch}
              onChange={(ev2) => onCamPitch(Number(ev2.target.value))} className="w-full accent-indigo-600" />
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

      <CurveFactsCard title="收敛的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">四种情形一张表</h3>
        <table className="text-xs text-gray-700 w-full">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left py-1">矩阵</th>
              <th className="py-1">谱隙</th>
              <th className="py-1">收敛</th>
              <th className="py-1">唯一</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100"><td className="py-1">正矩阵</td><td className="text-center">0.70</td><td className="text-center text-emerald-600">✓</td><td className="text-center text-emerald-600">✓</td></tr>
            <tr className="border-t border-gray-100"><td className="py-1">本原</td><td className="text-center">0.29</td><td className="text-center text-emerald-600">✓</td><td className="text-center text-emerald-600">✓</td></tr>
            <tr className="border-t border-gray-100"><td className="py-1">周期</td><td className="text-center">0</td><td className="text-center text-rose-600">✗</td><td className="text-center text-rose-600">✗</td></tr>
            <tr className="border-t border-gray-100"><td className="py-1">可约</td><td className="text-center">0</td><td className="text-center text-emerald-600">✓</td><td className="text-center text-rose-600">✗</td></tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">
          注意第四行：可约情形<b>迭代是收敛的</b>，问题出在收敛到哪取决于初值——所以光看「收不收敛」不够。
        </p>
      </div>
    </div>
  )
}
