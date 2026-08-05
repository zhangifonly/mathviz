/**
 * Prismatoid 实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  solidOf, SOLID_IDS, prismatoidVolume, prismatoidError, integrate,
  samplePoints, isExact, simpsonWeightCheck, simpsonQuarticError,
  SPECIAL_CASES, type SolidId,
} from './prismatoid'

export interface SidePanelProps {
  solidId: SolidId
  height: number
  focus: 0 | 1 | 2 | null
  onSolid: (id: SolidId) => void
  onHeight: (v: number) => void
  onFocus: (f: 0 | 1 | 2 | null) => void
}

export default function SidePanel(props: SidePanelProps) {
  const { solidId, height, focus, onSolid, onHeight, onFocus } = props
  const s = solidOf(solidId, height)
  const p = samplePoints(s)
  const vf = prismatoidVolume(s)
  const exact = isExact(s)
  const weightErrs = simpsonWeightCheck(1)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择立体</h3>
        <div className="space-y-2">
          {SOLID_IDS.map((id) => {
            const x = solidOf(id, height)
            return (
              <button
                key={id}
                onClick={() => onSolid(id)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${solidId === id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
              >
                <div className="flex justify-between">
                  <span>{x.label}</span>
                  <span className={`text-xs ${solidId === id ? 'opacity-80' : isExact(x) ? 'text-green-600' : 'text-red-500'}`}>
                    {x.degree} 次{isExact(x) ? '' : ' ✗'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          高度 h = {height.toFixed(2)}
        </label>
        <input
          type="range" min={0.5} max={5} step={0.1} value={height}
          onChange={(e) => onHeight(Number(e.target.value))}
          className="w-full mt-1"
        />

        <div className="mt-3 text-sm font-medium text-gray-700">高亮采样点</div>
        <div className="grid grid-cols-4 gap-2 mt-1">
          {(['S下', 'S中', 'S上'] as const).map((lab, i) => (
            <button
              key={lab}
              onClick={() => onFocus(focus === i ? null : (i as 0 | 1 | 2))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium ${focus === i ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {lab}
            </button>
          ))}
          <button
            onClick={() => onFocus(null)}
            className="px-2 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600"
          >
            全部
          </button>
        </div>
      </div>

      <CurveFactsCard
        title="三点定体积"
        rows={[
          ['S下', p.bottom.toFixed(6)],
          ['S中', p.middle.toFixed(6)],
          ['S上', p.top.toFixed(6)],
          ['h/6·(S下+4S中+S上)', vf.toFixed(8)],
          ['真实体积', s.volume.toFixed(8)],
          ['相对误差', prismatoidError(s).toExponential(2), exact ? '精确 ✓' : '失效'],
          ['数值积分', integrate(s, 8000).toFixed(8), '第三方参照'],
          ['A(t) 次数', `${s.degree}`, exact ? '≤ 3，公式成立' : '> 3，公式失效'],
          ['辛普森权重检验', weightErrs.every((e) => e < 1e-12) ? '1,t,t²,t³ 全精确' : '异常'],
          ['四次固有误差', simpsonQuarticError(1).toExponential(3), '不为 0'],
        ]}
        facts={[
          ['V = h/6 × (S下 + 4S中 + S上)', '，只量三个截面。'],
          ['A(t) 次数 ≤ 3 时精确', '，不是近似 —— 这是辛普森公式的性质。'],
          ['中学五个体积公式都是它的特例', '：柱、楔、锥、台、球。'],
          ['球最惊人', '：两端截面为零，只靠中间那一刀就定出 4πr³/3。'],
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold mb-2">中学公式都是特例</h3>
        <div className="space-y-1 text-xs">
          {SPECIAL_CASES.map((c) => (
            <div key={c.name} className="flex justify-between">
              <span className="text-gray-600">{c.name}</span>
              <span className="font-mono text-gray-500">{c.formula}</span>
              <span className="text-gray-400">{c.degree} 次</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
