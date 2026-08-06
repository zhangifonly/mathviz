import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  KIND_LABEL, PRESETS, convergenceRatio, focalC,
  gradientCheck, measureReflection, type Conic,
} from './conicReflection'

export interface SidePanelProps {
  presetId: string
  t: number
  mode: 'single' | 'fan' | 'billiard'
  showTangent: boolean
  sweeping: boolean
  conic: Conic
  onPreset: (id: string) => void
  onT: (v: number) => void
  onMode: (m: 'single' | 'fan' | 'billiard') => void
  onToggleTangent: () => void
  onToggleSweep: () => void
}

const deg = (r: number) => ((r * 180) / Math.PI).toFixed(6)
const sci = (v: number) => v.toExponential(2).replace('e+0', 'e+').replace('e-0', 'e-')

const MODES: Array<[SidePanelProps['mode'], string]> = [
  ['single', '单条光线'],
  ['fan', '光线扇'],
  ['billiard', '椭圆台球'],
]

export default function SidePanel({
  presetId, t, mode, showTangent, sweeping, conic,
  onPreset, onT, onMode, onToggleTangent, onToggleSweep,
}: SidePanelProps) {
  const m = measureReflection(conic, t)
  const g = gradientCheck(conic, t)
  const c = focalC(conic)
  const e = conic.kind === 'parabola' ? 1 : c / conic.a

  const rows: Array<[string, string, string?]> = [
    ['类型', KIND_LABEL[conic.kind], `e=${e.toFixed(4)}`],
    ['入射角（与切线）', `${deg(m.inAngle)}°`],
    ['反射角（与切线）', `${deg(m.outAngle)}°`],
    ['两角之差', sci(Math.abs(m.gap)), '应为 0'],
  ]

  if (g) {
    rows.push(
      ['梯度与角平分线夹角', sci(g.bisectorGap), '应为 0'],
      ['梯度与切线夹角 −90°', sci(g.perpGap), '应为 0'],
    )
  } else {
    rows.push(['第二焦点', '∞', '抛物线：出射方向即轴向'])
  }

  if (conic.kind === 'ellipse') {
    rows.push(['台球贴轴比率 (1−e)/(1+e)', convergenceRatio(conic).toFixed(6), '每弹一次'])
  }

  const facts: Array<[string, string]> = [
    ['三条反射性质是同一条：', '切线与两条焦半径成等角，这就是反射定律。'],
    ['为什么等角？', '椭圆是 |PF₁|+|PF₂| 的等值线，梯度 û₁+û₂ 沿角平分线，切线垂直于它。'],
    ['双曲线把和换成差：', '梯度 û₁−û₂ 落在外角平分线上，于是反射线像是从另一焦点发出。'],
    ['抛物线是 e→1 的极限：', 'F₂ 退到无穷远，「过第二焦点」读作「平行于对称轴」。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择曲线</h3>
        <div className="space-y-1.5">
          {PRESETS.map((p) => {
            const active = p.id === presetId
            return (
              <button
                key={p.id}
                onClick={() => onPreset(p.id)}
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

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">显示模式</h4>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(([id, label]) => {
            const disabled = id === 'billiard' && conic.kind !== 'ellipse'
            return (
              <button
                key={id}
                onClick={() => onMode(id)}
                disabled={disabled}
                title={disabled ? '台球只对闭合曲线有意义' : undefined}
                className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                  mode === id
                    ? 'bg-indigo-600 text-white'
                    : disabled
                      ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-1">
            反射点参数 t = {t.toFixed(3)}
          </label>
          <input
            type="range"
            min={conic.kind === 'ellipse' ? 0 : -2.2}
            max={conic.kind === 'ellipse' ? Math.PI * 2 : 2.2}
            step={0.001}
            value={t}
            onChange={(ev) => onT(Number(ev.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onToggleTangent}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showTangent ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showTangent ? '✓ ' : ''}切线/法线
          </button>
          <button
            onClick={onToggleSweep}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              sweeping ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {sweeping ? '⏸ 停止扫描' : '▶ 扫描反射点'}
          </button>
        </div>
      </div>

      <CurveFactsCard title="反射的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">它们被造成了什么</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">抛物面天线</b>：平行来的电磁波全部汇到焦点，接收机就装在那儿。</li>
          <li><b className="text-gray-800">车灯与探照灯</b>：反过来用，灯泡放在焦点，射出平行光束。</li>
          <li><b className="text-gray-800">回音壁与椭圆厅</b>：站在一个焦点低语，另一个焦点听得一清二楚。</li>
          <li><b className="text-gray-800">碎石机</b>：椭圆反射罩把一个焦点的冲击波聚到另一焦点上的结石。</li>
          <li><b className="text-gray-800">卡塞格林望远镜</b>：双曲面副镜利用「像从另一焦点发出」改变光路。</li>
        </ul>
      </div>
    </div>
  )
}
