/**
 * 球面螺线实验的右侧面板
 *
 * 两种螺线的参数含义不同：等角航线的 param 是与纬线的夹角 β，
 * 阿基米德螺线的 param 是绕圈系数 c。所以滑块范围随类型切换。
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  meridianAngle, meridianAngleAnalytic, loxodromeLength, sphereResidual,
  SPIRAL_INFO, PRESETS, type SpiralKind,
} from './sphericalSpiral'

export interface SidePanelProps {
  kind: SpiralKind
  param: number
  onPick: (k: SpiralKind, p: number) => void
  onParam: (v: number) => void
}

export default function SidePanel({ kind, param, onPick, onParam }: SidePanelProps) {
  const probes = [0.3, 0.9, 1.57, 2.3, 2.9]
  const angs = probes.map((th) => meridianAngle(kind, param, th))
  const spread = ((Math.max(...angs) - Math.min(...angs)) * 180) / Math.PI
  const maxRes = Math.max(...probes.map((th) => Math.abs(sphereResidual(kind, param, th))))
  const isLox = kind === 'loxodrome'

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择螺线</h3>
        <div className="space-y-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => onPick(p.kind, p.param)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${kind === p.kind && Math.abs(param - p.param) < 1e-9 ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <span>{p.label}</span><span className="text-xs opacity-70">{p.note}</span>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">
          {isLox ? `β = ${param.toFixed(2)} rad` : `绕圈系数 c = ${param.toFixed(1)}`}
        </h3>
        <input
          type="range"
          min={isLox ? 0.5 : 2} max={isLox ? 1.5 : 12} step={isLox ? 0.02 : 0.5}
          value={param}
          onChange={(e) => onParam(Number(e.target.value))}
          className="w-full" aria-label="螺线参数"
        />
      </div>

      <CurveFactsCard
        rows={[
          ['球面残差', maxRes.toExponential(1), '应为 0'],
          ['与经线夹角', `${((angs[0] * 180) / Math.PI).toFixed(2)}°`],
          ['夹角极差', `${spread.toFixed(2)}°`, isLox ? '恒定' : '随纬度变'],
          ...(isLox
            ? ([
              ['理论夹角 π/2−β', `${((meridianAngleAnalytic(param) * 180) / Math.PI).toFixed(2)}°`],
              ['总弧长 πR/sin β', loxodromeLength(param).toFixed(4), '有限'],
            ] as Array<[string, string, string?]>)
            : []),
        ]}
        facts={[
          [SPIRAL_INFO.find((s) => s.kind === kind)?.label ?? '',
            `：${SPIRAL_INFO.find((s) => s.kind === kind)?.note ?? ''}`],
          ['墨卡托投影', ' 1569 年就是为让等角航线成为直线而设计的。'],
          ['绕无穷多圈却弧长有限', '：等角航线最反直觉的性质。'],
        ]}
      />
    </div>
  )
}
