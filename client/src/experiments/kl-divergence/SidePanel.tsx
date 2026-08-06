import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  asymmetry, crossEntropy, entropy, jensenShannon, klDivergence,
  pinskerBound, totalVariation, type Dist, type Preset,
} from './klDivergence'

export interface SidePanelProps {
  presetId: string
  p: Dist
  q: Dist
  camYaw: number
  camPitch: number
  show: [boolean, boolean, boolean]
  spinning: boolean
  presets: Preset[]
  onPreset: (id: string) => void
  onP: (p: Dist) => void
  onQ: (q: Dist) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleShow: (i: number) => void
  onToggleSpin: () => void
}

const NAMES = ['D(p‖q)', 'D(q‖p)', 'JS 散度']
const DOTS = ['bg-sky-400', 'bg-pink-400', 'bg-emerald-400']
const f = (v: number) => (Number.isFinite(v) ? v.toFixed(6) : '∞')

export default function SidePanel({
  presetId, p, q, camYaw, camPitch, show, spinning, presets,
  onPreset, onP, onQ, onCamYaw, onCamPitch, onToggleShow, onToggleSpin,
}: SidePanelProps) {
  const dpq = klDivergence(p, q)
  const dqp = klDivergence(q, p)
  const ce = crossEntropy(p, q)
  const H = entropy(p)

  const rows: Array<[string, string, string?]> = [
    ['H(p)', H.toFixed(6), '用对分布的下界'],
    ['D(p‖q)', f(dpq), '用错分布多付的'],
    ['D(q‖p)', f(dqp), '反过来算'],
    ['不对称 |差|', Number.isFinite(asymmetry(p, q)) ? asymmetry(p, q).toFixed(6) : '∞', 'KL 不是距离'],
    ['交叉熵 H(p,q)', f(ce), '= H(p) + D(p‖q)'],
    ['JS 散度', jensenShannon(p, q).toFixed(6), '对称且恒有限'],
    ['总变差 TV', totalVariation(p, q).toFixed(6), '真正的距离'],
    ['Pinsker 界 √(D·ln2/2)', f(pinskerBound(p, q)), 'TV 不超过它'],
  ]

  const facts: Array<[string, string]> = [
    ['KL 是什么：', '上一课说熵是用对分布时的编码下界。以为分布是 q 而实际是 p，多付的比特数就是 D(p‖q)。'],
    ['Gibbs 不等式：', 'D ≥ 0，等号当且仅当 p = q。用错分布只会更费，绝不会更省——这是极大似然估计的理论根据。'],
    ['交叉熵 = 熵 + KL：', 'H(p) 与模型无关，所以「最小化交叉熵」与「最小化 KL」完全等价。这就是分类损失的来历。'],
    ['KL 不是距离：', '既不对称，也不满足三角不等式。本课给了具体反例。要距离就用 JS 散度或总变差。'],
    ['q=0 而 p>0 时是真无穷：', '模型说不可能的事发生了，需要无穷多比特来编码。这不是数值溢出，界面上如实显示 ∞。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择一对分布</h3>
        <div className="space-y-1.5">
          {presets.map((s) => (
            <button
              key={s.id}
              onClick={() => onPreset(s.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center gap-2 ${
                s.id === presetId ? 'bg-indigo-600 text-white font-medium' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="shrink-0">{s.label}</span>
              <span className={`text-xs text-right ${s.id === presetId ? 'text-indigo-100' : 'text-gray-400'}`}>{s.note}</span>
            </button>
          ))}
        </div>

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">真实分布 p</h4>
        {p.map((v, i) => (
          <div className="mt-2" key={`p${i}`}>
            <label className="block text-xs text-gray-600 mb-1">p{i + 1} = {v.toFixed(4)}</label>
            <input
              type="range" min={0.01} max={1} step={0.005} value={v}
              onChange={(e) => {
                const n = [...p]
                n[i] = Number(e.target.value)
                onP(n)
              }}
              className="w-full accent-amber-500"
            />
          </div>
        ))}

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">模型分布 q</h4>
        {q.map((v, i) => (
          <div className="mt-2" key={`q${i}`}>
            <label className="block text-xs text-gray-600 mb-1">q{i + 1} = {v.toFixed(4)}</label>
            <input
              type="range" min={0} max={1} step={0.005} value={v}
              onChange={(e) => {
                const n = [...q]
                n[i] = Number(e.target.value)
                onQ(n)
              }}
              className="w-full accent-orange-500"
            />
          </div>
        ))}
        <p className="text-xs text-gray-400 mt-1.5">
          把某个 q 拖到 0 试试 —— KL 会变成 ∞，而 JS 依然有限。
        </p>

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">显示高度场</h4>
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
            <input type="range" min={0.05} max={1.3} step={0.01} value={camPitch}
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

      <CurveFactsCard title="散度的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">两个方向，两种用途</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">D(p‖q) 前向</b>：p 有质量的地方 q 也必须有，否则罚到无穷。所以拟合出的 q 会「覆盖」p 的所有峰——趋向<b>平均</b>。</li>
          <li><b className="text-gray-800">D(q‖p) 反向</b>：q 只在自己有质量的地方受罚。所以 q 会缩到 p 的某一个峰上——趋向<b>挑一个模式</b>。</li>
          <li><b className="text-gray-800">变分推断</b>用反向 KL，所以常低估方差；<b>极大似然</b>等价于最小化前向 KL。</li>
          <li><b className="text-gray-800">分类损失</b>就是交叉熵，也就是前向 KL 加一个常数。</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          把两张曲面都打开，就能看到这两种「罚法」的形状差异。
        </p>
      </div>
    </div>
  )
}
