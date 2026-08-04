/**
 * 闵可夫斯基和实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  steinerTerms, steinerArea, meanCurvatureFromEdges, totalEdgeLength,
  support, width, SOLIDS, type Solid, type SolidId,
} from './minkowskiSteiner'

const DEG = 180 / Math.PI
const TERM_NAMES = ['本体 V', '面 S·r', '棱 M·r²', '顶点 (4π/3)r³'] as const

export interface SidePanelProps {
  solid: Solid
  solidId: SolidId
  r: number
  highlight: 0 | 1 | 2 | 3 | null
  onSolid: (id: SolidId) => void
  onR: (r: number) => void
  onHighlight: (h: 0 | 1 | 2 | 3 | null) => void
}

export default function SidePanel(props: SidePanelProps) {
  const { solid, solidId, r, highlight, onSolid, onR, onHighlight } = props
  const t = steinerTerms(solid, r)
  const pct = (v: number) => `${((v / t.total) * 100).toFixed(1)}%`

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择立体</h3>
        <div className="grid grid-cols-3 gap-2">
          {SOLIDS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSolid(s.id as SolidId)}
              className={`px-2 py-2 rounded-lg text-xs font-medium ${solidId === s.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          球半径 r = {r.toFixed(3)}
        </label>
        <input
          type="range" min={0} max={1.5} step={0.01} value={r}
          onChange={(e) => onR(Number(e.target.value))}
          className="w-full mt-1"
        />

        <div className="mt-3 text-sm font-medium text-gray-700">高亮哪一项</div>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {TERM_NAMES.map((name, i) => (
            <button
              key={name}
              onClick={() => onHighlight(highlight === i ? null : (i as 0 | 1 | 2 | 3))}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium ${highlight === i ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {name}
            </button>
          ))}
        </div>
        {highlight !== null && (
          <button
            onClick={() => onHighlight(null)}
            className="w-full mt-2 px-2 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-600"
          >
            显示全部
          </button>
        )}
      </div>

      <CurveFactsCard
        title="斯坦纳公式读数"
        rows={[
          ['V(r) 总体积', t.total.toFixed(5)],
          ['本体 V', `${t.body.toFixed(4)}（${pct(t.body)}）`],
          ['面 S·r', `${t.faces.toFixed(4)}（${pct(t.faces)}）`, `S = ${solid.area.toFixed(4)}`],
          ['棱 M·r²', `${t.edges.toFixed(4)}（${pct(t.edges)}）`, `M = ${solid.meanCurvature.toFixed(4)}`],
          ['顶点 (4π/3)r³', `${t.vertices.toFixed(4)}（${pct(t.vertices)}）`, '恒为一整个球'],
          ['圆角体表面积', steinerArea(solid, r).toFixed(5), '= V(r) 的导数'],
          ['棱长总和', totalEdgeLength(solid).toFixed(4)],
          ['二面角', `${(solid.dihedral * DEG).toFixed(2)}°`],
          ['M 反算校验', meanCurvatureFromEdges(solid).toFixed(4), '与 M 一致'],
          ['h(1,0,0)', support(solid, [1, 0, 0]).toFixed(4), `+r = ${(support(solid, [1, 0, 0]) + r).toFixed(4)}`],
          ['x 方向宽度', width(solid, [1, 0, 0]).toFixed(4)],
        ]}
        facts={[
          ['V(r) = V + S·r + M·r² + (4π/3)r³', '，用球擦一遍，体积是 r 的三次多项式。']
          ,['四项对应本体、面、棱、顶点', '：证明就是把圆角体拆开数。'],
          ['顶点项恒为一整个球', '：凸多面体的外立体角之和恒为 4π，与顶点个数无关。'],
          ['支持函数把闵和变成加法', '：h(K⊕rB) = h(K) + r，每个方向都外推 r。'],
        ]}
      />
    </div>
  )
}
