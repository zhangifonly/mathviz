/**
 * 空间填充实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  DIHEDRAL_ANGLES, edgeFitCount, gapAngle, maxFitCount,
  enumeratePlanarTilings, FCC_SPHERE_DENSITY, FILL_INFO, infoOf,
  type FillKind,
} from './spaceFillingSolids'

export interface SidePanelProps {
  kind: FillKind
  copies: number
  showGap: boolean
  onKind: (k: FillKind) => void
  onCopies: (v: number) => void
  onToggleGap: () => void
}

export default function SidePanel(props: SidePanelProps) {
  const { kind, copies, showGap, onKind, onCopies, onToggleGap } = props
  const info = infoOf(kind)
  const tetra = DIHEDRAL_ANGLES.tetrahedron
  const planar = enumeratePlanarTilings(20)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">能填充的多面体</h3>
        <div className="space-y-2">
          {FILL_INFO.map((f) => (
            <button
              key={f.kind}
              onClick={() => onKind(f.kind)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${kind === f.kind && !showGap ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div className="flex justify-between">
                <span>{f.label}</span>
                <span className="text-xs opacity-70">{f.V}/{f.E}/{f.F}</span>
              </div>
              <div className="text-xs opacity-70 mt-0.5">{f.note}</div>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 mt-4">堆叠胞数：{copies}</h3>
        <input
          type="range" min={1} max={5} step={1} value={copies}
          onChange={(e) => onCopies(Number(e.target.value))}
          className="w-full" aria-label="堆叠胞数"
        />
        <button
          onClick={onToggleGap}
          className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${showGap ? 'bg-red-400 text-red-900' : 'bg-gray-100 text-gray-600'}`}
        >
          {showGap ? '✓ 正在看正四面体的缝隙' : '看亚里士多德的错误'}
        </button>
      </div>

      <CurveFactsCard
        title="填充判据"
        rows={[
          ['当前立体', `${info.label} (${info.V}/${info.E}/${info.F})`],
          ['立方体二面角', '90°', `360/90 = ${edgeFitCount(90)} 整除 ✓`],
          ['正四面体二面角', `${tetra.toFixed(4)}°`, `360/角 = ${edgeFitCount(tetra).toFixed(4)} 不整除 ✗`],
          ['四面体堆 5 个剩缝', `${gapAngle(tetra, maxFitCount(tetra)).toFixed(4)}°`],
          ['平面能镶嵌的正多边形', `n = ${planar.join(', ')}`, '只有三种'],
          ['最密球堆积密度', `${(FCC_SPHERE_DENSITY * 100).toFixed(2)}%`, '开普勒猜想'],
          ['多面体填充密度', '100%', '一点缝都不留'],
        ]}
        facts={[
          ['判据: 360°/二面角为整数', '，五种柏拉图立体里只有立方体满足。'],
          ['亚里士多德的千年错误', `：正四面体差 ${gapAngle(tetra, 5).toFixed(2)}°，15 世纪才被纠正。`],
          ['菱形十二面体', ' 是最密球堆积的 Voronoi 胞，蜂巢的三维版。'],
          [`平面 ${planar.length} 种、空间 1 种`, '，维度升高反而更受限。'],
        ]}
      />
    </div>
  )
}
