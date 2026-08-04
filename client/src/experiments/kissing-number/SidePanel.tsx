/**
 * 接吻数实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  arrangementOf, minPairAngle, slack, capCoverage, capSolidAngle,
  naiveUpperBound, findExtraSphere, kissing2DGap,
  MIN_ANGLE, ARRANGEMENTS, KNOWN_KISSING, type ArrangementId,
} from './kissingNumber'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  arrId: ArrangementId
  showCaps: boolean
  showGap: boolean
  onArr: (id: ArrangementId) => void
  onToggleCaps: () => void
  onToggleGap: () => void
}

export default function SidePanel(props: SidePanelProps) {
  const { arrId, showCaps, showGap, onArr, onToggleCaps, onToggleGap } = props
  const arr = arrangementOf(arrId)
  const probe = findExtraSphere(arr.dirs, 8000)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择排列</h3>
        <div className="space-y-2">
          {ARRANGEMENTS.map((id) => {
            const a = arrangementOf(id)
            return (
              <button
                key={id}
                onClick={() => onArr(id)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${arrId === id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
              >
                <div className="flex justify-between">
                  <span>{a.label}</span>
                  <span className="text-xs opacity-70">{a.dirs.length} 球</span>
                </div>
                <div className="text-xs opacity-70 mt-0.5">{a.note}</div>
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={onToggleCaps}
            className={`px-2 py-2 rounded-lg text-xs font-medium ${showCaps ? 'bg-green-400 text-green-900' : 'bg-gray-100 text-gray-600'}`}
          >
            {showCaps ? '✓ 球冠' : '球冠'}
          </button>
          <button
            onClick={onToggleGap}
            className={`px-2 py-2 rounded-lg text-xs font-medium ${showGap ? 'bg-red-400 text-red-900' : 'bg-gray-100 text-gray-600'}`}
          >
            {showGap ? '✓ 最大空位' : '最大空位'}
          </button>
        </div>
      </div>

      <CurveFactsCard
        title="接吻数读数"
        rows={[
          ['邻球数', `${arr.dirs.length}`],
          ['最小角距', `${(minPairAngle(arr.dirs) * DEG).toFixed(4)}°`, `需 ≥ ${(MIN_ANGLE * DEG).toFixed(0)}°`],
          ['余量', `${(slack(arr.dirs) * DEG).toFixed(4)}°`, slack(arr.dirs) > 1e-9 ? '有富余' : '零余量'],
          ['球冠立体角', `${capSolidAngle().toFixed(5)} sr`, '半角 30°'],
          ['球冠覆盖率', `${(capCoverage(arr.dirs) * 100).toFixed(2)}%`, '剩下都是空隙'],
          ['最大空位角距', `${(probe.bestAngle * DEG).toFixed(3)}°`, probe.found ? '还能再加！' : '塞不下'],
          ['朴素上界 4π/球冠', naiveUpperBound().toFixed(4), '挡不住 13'],
          ['二维相邻角距', `${(kissing2DGap() * DEG).toFixed(1)}°`, '恰好用尽 360°'],
        ]}
        facts={[
          ['三维接吻数是 12', '，牛顿与格雷戈里 1694 年为此争论，1953 年才证明。'],
          ['12 球只覆盖球面 80%', '，剩下 20% 空隙看着够第 13 个球，但挪不到一起。'],
          ['朴素上界给 14.93', '，挡不住 13 —— 这就是争论持续 250 年的原因。'],
          ['六球排列虽松却已卡死', '：最大空位只有 54.74°，不到 60°。'],
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold mb-2">各维度的接吻数</h3>
        <div className="space-y-1 text-sm">
          {KNOWN_KISSING.map((k) => (
            <div key={k.dim} className="flex justify-between">
              <span className="text-gray-500">{k.dim} 维</span>
              <span className="font-medium">{k.tau.toLocaleString()}</span>
              <span className="text-xs text-gray-400 w-32 text-right">{k.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
