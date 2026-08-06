import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  DEFAULT_CONFOCAL, KIND_LABEL, kindOf, orthogonality, solveLambdas,
  type Preset,
} from './confocalQuadrics'

export interface SidePanelProps {
  point: [number, number, number]
  yaw: number
  pitch: number
  show: [boolean, boolean, boolean]
  showNormals: boolean
  alpha: number
  spinning: boolean
  presets: Preset[]
  onPoint: (p: [number, number, number]) => void
  onYaw: (v: number) => void
  onPitch: (v: number) => void
  onToggleShow: (i: number) => void
  onToggleNormals: () => void
  onAlpha: (v: number) => void
  onToggleSpin: () => void
}

const sci = (v: number) => v.toExponential(2).replace('e+0', 'e+').replace('e-0', 'e-')
const AXES: Array<[number, string]> = [[0, 'x'], [1, 'y'], [2, 'z']]
const SURF_COLOR = ['bg-sky-400', 'bg-orange-400', 'bg-violet-400']

export default function SidePanel({
  point, yaw, pitch, show, showNormals, alpha, spinning, presets,
  onPoint, onYaw, onPitch, onToggleShow, onToggleNormals, onAlpha, onToggleSpin,
}: SidePanelProps) {
  const q = DEFAULT_CONFOCAL
  const ls = solveLambdas(q, point)
  const o = orthogonality(q, point)

  const rows: Array<[string, string, string?]> = [
    ['a, b, c', `${q.a}, ${q.b}, ${q.c}`, '共用的焦点由它们定'],
  ]
  if (ls) {
    ls.forEach((l, i) => {
      rows.push([`λ${'₁₂₃'[i]}`, l.toFixed(8), KIND_LABEL[kindOf(q, l)]])
    })
  } else {
    rows.push(['λ', '—', '点落在坐标平面上，退化'])
  }
  if (o) {
    const names = ['①②', '①③', '②③']
    o.pairs.forEach((pr, i) => {
      rows.push([
        `法向量 ${names[i]} 与 90° 的偏差`,
        sci(pr.angleDev),
        '应为 0',
      ])
    })
  }

  const facts: Array<[string, string]> = [
    ['共焦 = 只改分母不改分子：', 'x²/(a²−λ)+y²/(b²−λ)+z²/(c²−λ)=1，整族共用同一组焦点。'],
    ['λ 的三段决定三种曲面：', 'λ<c² 椭球，c²<λ<b² 单叶双曲面，b²<λ<a² 双叶双曲面。'],
    ['Jacobi 定理：', '过空间任一点恰有三张共焦曲面，一种一张，而且两两正交。'],
    ['所以 (λ₁,λ₂,λ₃) 是一套坐标：', '椭球坐标，三维里少数几个能让拉普拉斯方程分离变量的正交坐标系之一。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">交点位置</h3>
        <div className="space-y-1.5">
          {presets.map((p) => {
            const active = p.point.every((v, i) => Math.abs(v - point[i]) < 1e-9)
            return (
              <button
                key={p.id}
                onClick={() => onPoint([...p.point] as [number, number, number])}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                  active ? 'bg-indigo-600 text-white font-medium' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{p.label}</span>
                <span className={`text-xs ${active ? 'text-indigo-100' : 'text-gray-400'}`}>{p.note}</span>
              </button>
            )
          })}
        </div>

        {AXES.map(([i, name]) => (
          <div className="mt-3" key={name}>
            <label className="block text-sm text-gray-700 mb-1">
              {name} = {point[i].toFixed(2)}
            </label>
            <input
              type="range" min={-4} max={4} step={0.01} value={point[i]}
              onChange={(ev) => {
                const n = [...point] as [number, number, number]
                n[i] = Number(ev.target.value)
                onPoint(n)
              }}
              className="w-full accent-indigo-600"
            />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">显示</h3>
        <div className="space-y-1.5">
          {['椭球面 λ₁', '单叶双曲面 λ₂', '双叶双曲面 λ₃'].map((label, i) => (
            <button
              key={label}
              onClick={() => onToggleShow(i)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                show[i] ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-400'
              }`}
            >
              <span className={`w-4 h-2.5 rounded ${SURF_COLOR[i]} ${show[i] ? '' : 'opacity-30'}`} />
              {show[i] ? '✓ ' : ''}{label}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1">不透明度 {alpha.toFixed(2)}</label>
          <input
            type="range" min={0.15} max={0.95} step={0.01} value={alpha}
            onChange={(ev) => onAlpha(Number(ev.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">水平角 {(yaw * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0} max={Math.PI * 2} step={0.01} value={yaw}
              onChange={(ev) => onYaw(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">俯仰角 {(pitch * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={-1.2} max={1.2} step={0.01} value={pitch}
              onChange={(ev) => onPitch(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onToggleNormals}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showNormals ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showNormals ? '✓ ' : ''}三条法向量
          </button>
          <button
            onClick={onToggleSpin}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              spinning ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {spinning ? '⏸ 停止旋转' : '▶ 旋转'}
          </button>
        </div>
      </div>

      <CurveFactsCard title="三张面的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">为什么值得看</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">椭球坐标</b>：三个 λ 就是一套正交坐标，用来解椭球体的引力势与静电势。</li>
          <li><b className="text-gray-800">可分离变量</b>：拉普拉斯方程在其中可分离，得到 Lamé 函数。</li>
          <li><b className="text-gray-800">测地线与台球</b>：椭球面上的测地线与共焦族相切，这是 Jacobi 可积性的来源。</li>
          <li><b className="text-gray-800">二维没有对应物</b>：平面上过一点只有两条共焦曲线；三张面两两正交，只有在空间里才看得见。</li>
        </ul>
      </div>
    </div>
  )
}
