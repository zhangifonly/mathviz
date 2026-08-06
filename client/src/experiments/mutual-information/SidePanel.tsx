import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  becCapacityAnalytic, binaryEntropy, bscCapacityAnalytic, channelCapacity,
  conditionalEntropyXgivenY, entropy, jointEntropy, makeJoint, marginalX,
  marginalY, mutualInformation, mutualInformationAsKL,
  type ChannelKind, type Preset,
} from './mutualInformation'

export interface SidePanelProps {
  presetId: string
  kind: ChannelKind
  a: number
  e: number
  camYaw: number
  camPitch: number
  showRidge: boolean
  spinning: boolean
  presets: Preset[]
  onPreset: (id: string) => void
  onKind: (k: ChannelKind) => void
  onA: (v: number) => void
  onE: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleRidge: () => void
  onToggleSpin: () => void
}

const KINDS: Array<[ChannelKind, string]> = [
  ['bsc', '对称 BSC'],
  ['bec', '擦除 BEC'],
  ['z', 'Z 信道'],
]

export default function SidePanel({
  presetId, kind, a, e, camYaw, camPitch, showRidge, spinning, presets,
  onPreset, onKind, onA, onE, onCamYaw, onCamPitch, onToggleRidge, onToggleSpin,
}: SidePanelProps) {
  const J = makeJoint(a, e, kind)
  const I = mutualInformation(J)
  const cap = channelCapacity(e, kind)
  const HX = entropy(marginalX(J))
  const HY = entropy(marginalY(J))

  const rows: Array<[string, string, string?]> = [
    ['H(X)', HX.toFixed(6), '输入的不确定性'],
    ['H(Y)', HY.toFixed(6)],
    ['H(X,Y)', jointEntropy(J).toFixed(6)],
    ['H(X|Y)', conditionalEntropyXgivenY(J).toFixed(6), '看到 Y 后还剩多少'],
    ['I(X;Y)', I.toFixed(6), '= H(X) − H(X|Y)'],
    ['I 的 KL 形式', mutualInformationAsKL(J).toFixed(6), '两者应相等'],
    ['信道容量 C', cap.capacity.toFixed(6), '= max over a'],
    ['最优输入 a*', cap.capacity < 1e-12 ? '—' : cap.aStar.toFixed(4)],
    ['离容量还差', (cap.capacity - I).toFixed(6), Math.abs(cap.capacity - I) < 1e-6 ? '已达到' : ''],
  ]

  if (kind === 'bsc') {
    rows.push(['解析容量 1−H(e)', bscCapacityAnalytic(e).toFixed(6), '与数值一致'])
  } else if (kind === 'bec') {
    rows.push(['解析容量 1−e', becCapacityAnalytic(e).toFixed(6), '与数值一致'])
  }

  const facts: Array<[string, string]> = [
    ['互信息有四个等价写法：', 'H(X)−H(X|Y)、H(Y)−H(Y|X)、H(X)+H(Y)−H(X,Y)、以及 D(P_XY‖P_X·P_Y)。'],
    ['最后一个接回上一课：', '互信息就是「实际联合分布」与「假装独立」之间的 KL 散度。所以 I ≥ 0 来自 Gibbs 不等式，独立时恰为 0。'],
    ['决策树的信息增益就是它：', '项目里决策树那课一直在用信息增益选分裂，其实就是 I(标签; 特征)——但那课没点破这层关系。'],
    ['容量是最大值，不是随便一个：', 'C = max over 输入分布。BSC 在均匀输入时取到 1−H(e)；输入 a=0.3 时只有 0.456 < 0.531。'],
    ['擦除比翻转温和：', 'BEC 容量是 1−e，BSC 是 1−H(e)。同样 e=0.1，前者 0.900 后者只有 0.531——因为接收方知道自己丢了哪一位。'],
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

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">信道类型</h4>
        <div className="grid grid-cols-3 gap-2">
          {KINDS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => onKind(id)}
              className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                kind === id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-1">
            输入分布 a = {a.toFixed(3)}
            <span className="text-gray-400 text-xs ml-1">P(X=0)</span>
          </label>
          <input
            type="range" min={0} max={1} step={0.005} value={a}
            onChange={(ev) => onA(Number(ev.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">
            噪声 e = {e.toFixed(3)}
            <span className="text-gray-400 text-xs ml-1">
              {kind === 'bsc' ? 'H(e)=' + binaryEntropy(e).toFixed(3) : kind === 'bec' ? '擦除概率' : '1→0 的概率'}
            </span>
          </label>
          <input
            type="range" min={0} max={1} step={0.005} value={e}
            onChange={(ev) => onE(Number(ev.target.value))}
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
            <input type="range" min={0.05} max={1.3} step={0.01} value={camPitch}
              onChange={(ev) => onCamPitch(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onToggleRidge}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showRidge ? 'bg-rose-400 text-rose-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showRidge ? '✓ ' : ''}容量脊线
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

      <CurveFactsCard title="信道的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">三种信道的容量</h3>
        <table className="text-sm text-gray-700 w-full">
          <thead>
            <tr className="text-gray-500 text-xs">
              <th className="text-left py-1">信道</th>
              <th className="py-1">容量</th>
              <th className="py-1">e=0.1 时</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="py-1">BSC 翻转</td><td className="text-center">1−H(e)</td><td className="text-center">0.531</td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="py-1">BEC 擦除</td><td className="text-center">1−e</td><td className="text-center">0.900</td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="py-1">Z 信道</td><td className="text-center">无简单闭式</td><td className="text-center">0.763</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">
          翻转比擦除糟糕得多：擦除时接收方<b>知道</b>哪一位丢了，翻转时却<b>不知道</b>哪一位错了。
          e=0.5 的 BSC 容量为零——不是传得慢，是根本传不了。
        </p>
      </div>
    </div>
  )
}
