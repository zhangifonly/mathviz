import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  KIND_LABEL, classify, directrixX, focusDirectrixRatio,
  standardParams, secondFocusX, twoFocusCheck, ASTRO,
  type Preset,
} from './focusDirectrix'

export interface SidePanelProps {
  e: number
  l: number
  theta: number
  showRatio: boolean
  sweeping: boolean
  presets: Preset[]
  onE: (v: number) => void
  onTheta: (v: number) => void
  onPreset: (e: number) => void
  onToggleRatio: () => void
  onToggleSweep: () => void
}

const f8 = (v: number) => (Number.isFinite(v) ? v.toFixed(8) : '∞')
const sci = (v: number) => v.toExponential(2).replace('e+0', 'e+').replace('e-0', 'e-')

export default function SidePanel({
  e, l, theta, showRatio, sweeping, presets,
  onE, onTheta, onPreset, onToggleRatio, onToggleSweep,
}: SidePanelProps) {
  const kind = classify(e)
  const fd = focusDirectrixRatio(e, l, theta)
  const sp = standardParams(e, l)
  const tf = twoFocusCheck(e, l, theta)

  const rows: Array<[string, string, string?]> = [
    ['类型', KIND_LABEL[kind], `e=${e.toFixed(3)}`],
    ['|PF|', fd ? f8(fd.pf) : '—'],
    ['到准线 d', fd ? f8(fd.pd) : '—'],
    ['比值 |PF|/d', fd ? f8(fd.ratio) : '—', '应恒等于 e'],
    ['与 e 的差', fd ? sci(Math.abs(fd.ratio - e)) : '—', '应为 0'],
    ['准线 x', f8(directrixX(e, l)), e === 0 ? '退到无穷远' : undefined],
  ]

  if (kind !== 'parabola') {
    rows.push(
      ['长半轴 a', f8(sp.a)],
      ['半焦距 c', f8(sp.c)],
      ['第二焦点 x', f8(secondFocusX(e, l)), kind === 'hyperbola' ? '在焦点右侧' : '在焦点左侧'],
    )
    if (tf) {
      rows.push([
        kind === 'ellipse' ? '|PF₁|+|PF₂|' : '||PF₁|−|PF₂||',
        f8(tf.sumOrDiff),
        `应=2a=${tf.expected2a.toFixed(6)}`,
      ])
    }
  } else {
    rows.push(['第二焦点', '∞', '抛物线只有一个焦点'])
  }

  const facts: Array<[string, string]> = [
    ['一条定义三种曲线：', '|PF| = e·d(P, 准线)。只改 e，不改定义。'],
    ['e<1 椭圆，e=1 抛物线，e>1 双曲线。', 'e=0 时准线退到无穷远，曲线退化成圆。'],
    ['半正焦弦 l 固定时', '曲线随 e 连续变形，在 e=1 处不断裂，但 a 发散到无穷。'],
    ['e>1 时轨迹是两支。', '远支同样满足这条定义，不是多余的画法。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择配置</h3>
        <div className="space-y-1.5">
          {presets.map((p) => {
            const active = Math.abs(p.e - e) < 1e-9
            return (
              <button
                key={p.id}
                onClick={() => onPreset(p.e)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                  active
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{p.label}</span>
                <span className={`text-xs ${active ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {p.note}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-1">
            离心率 e = {e.toFixed(3)}
            <span className="text-gray-400 text-xs ml-1">（拖过 1 看类型切换）</span>
          </label>
          <input
            type="range" min={0} max={3} step={0.001} value={e}
            onChange={(ev) => onE(Number(ev.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">
            动点极角 θ = {(theta * 180 / Math.PI).toFixed(0)}°
          </label>
          <input
            type="range" min={0} max={Math.PI * 2} step={0.001} value={theta}
            onChange={(ev) => onTheta(Number(ev.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onToggleRatio}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showRatio ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showRatio ? '✓ ' : ''}测量线段
          </button>
          <button
            onClick={onToggleSweep}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              sweeping ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {sweeping ? '⏸ 停止扫描' : '▶ 扫描 θ'}
          </button>
        </div>
      </div>

      <CurveFactsCard title="定义式的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">真实天体的 e</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          {ASTRO.map((a) => (
            <li key={a.name} className="flex justify-between">
              <span>{a.name}</span>
              <b className={a.e >= 1 ? 'text-rose-600' : 'text-gray-800'}>
                {a.e.toFixed(4)}
              </b>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          行星的 e 都很小（近圆）；哈雷彗星 0.967 已经很扁；2I/Borisov 的 e&gt;1，
          说明它不属于太阳系，是穿过来的。
        </p>
      </div>
    </div>
  )
}
