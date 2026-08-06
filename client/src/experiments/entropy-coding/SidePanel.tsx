import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  blockCodeLength, entropy, huffmanAverageLength, huffmanLengths,
  isDyadic, kraftSum, maxEntropy, redundancy, type Dist, type Preset,
} from './entropyCoding'

export interface SidePanelProps {
  presetId: string
  p: Dist
  blockK: number
  camYaw: number
  camPitch: number
  show: [boolean, boolean, boolean]
  spinning: boolean
  presets: Preset[]
  onPreset: (id: string) => void
  onP: (p: Dist) => void
  onBlockK: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleShow: (i: number) => void
  onToggleSpin: () => void
}

const NAMES = ['熵 H(p)', '哈夫曼码长 L', '冗余 L − H']
const DOTS = ['bg-emerald-400', 'bg-amber-400', 'bg-pink-400']

export default function SidePanel({
  presetId, p, blockK, camYaw, camPitch, show, spinning, presets,
  onPreset, onP, onBlockK, onCamYaw, onCamPitch, onToggleShow, onToggleSpin,
}: SidePanelProps) {
  const H = entropy(p)
  const L = huffmanAverageLength(p)
  const r = redundancy(p)
  const lens = huffmanLengths(p)
  const Lk = blockCodeLength(p, blockK)

  const rows: Array<[string, string, string?]> = [
    ['熵 H(p)', `${H.toFixed(6)} 比特`, `上限 ${maxEntropy(p.length).toFixed(4)}`],
    ['各符号码长', lens.join(' , ')],
    ['平均码长 L', L.toFixed(6)],
    ['冗余 L − H', r.toFixed(6), r < 1e-9 ? '零浪费' : '有浪费'],
    ['是否二进制概率', isDyadic(p) ? '是' : '否', isDyadic(p) ? '故 L = H' : '故 L > H'],
    ['Kraft Σ2^(−L)', kraftSum(lens).toFixed(6), '=1 表示码树填满'],
    [`分 ${blockK} 个一组后每符号`, Lk.toFixed(6), `理论上界 ${(H + 1 / blockK).toFixed(4)}`],
    ['分组后的浪费', (Lk - H).toFixed(6), blockK > 1 ? `原来 ${r.toFixed(4)}` : ''],
  ]

  const facts: Array<[string, string]> = [
    ['两课都碰到熵却没说透：', '决策树把它当分裂准则，哈夫曼造出最优码，但都没说熵为什么是它、最优能优到哪。'],
    ['信源编码定理：', 'H(p) ≤ L* < H(p)+1。左边说谁也不可能比熵更短，右边说哈夫曼最多浪费不到一比特。'],
    ['二进制概率时零浪费：', 'p 全是 2 的负整数次幂时，最优码长恰好是 −log₂p，平均码长精确等于熵。'],
    ['单符号不可能少于一比特：', 'p=[0.9,0.1] 的熵只有 0.469，但哈夫曼只能给 1 —— 这才需要分组编码。'],
    ['分组把 +1 摊薄成 +1/k：', '但并非每一步都更好：码长要取整，p=[0.7,0.2,0.1] 时 k=3 反而比 k=2 差。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择分布</h3>
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

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">直接调整 p（自动归一化）</h4>
        {p.map((v, i) => (
          <div className="mt-2" key={i}>
            <label className="block text-xs text-gray-600 mb-1">p{i + 1} = {v.toFixed(4)}</label>
            <input
              type="range" min={0.01} max={1} step={0.005} value={v}
              onChange={(e) => {
                const n = [...p]
                n[i] = Number(e.target.value)
                onP(n)
              }}
              className="w-full accent-indigo-600"
            />
          </div>
        ))}

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">
            分组大小 k = {blockK}
            <span className="text-gray-400 text-xs ml-1">（把 k 个符号打包）</span>
          </label>
          <input
            type="range" min={1} max={5} step={1} value={blockK}
            onChange={(e) => onBlockK(Number(e.target.value))}
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

      <CurveFactsCard title="编码的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">熵为什么只能是 −Σp log p</h3>
        <p className="text-sm text-gray-600 mb-2">
          Shannon 证明了：只要求三条性质，度量就被唯一确定（相差一个常数因子，即对数的底）。
        </p>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li><b className="text-gray-800">连续性</b>：概率微小变化时，不确定性也只微小变化。</li>
          <li><b className="text-gray-800">单调性</b>：n 个等概率选项时，n 越大越不确定。</li>
          <li><b className="text-gray-800">可加性</b>：独立信源合起来，不确定性相加。</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          第三条是最强的约束。本课验证了 H(p^k) = k·H(p)，误差在 1e−15 量级。
        </p>
      </div>
    </div>
  )
}
