/**
 * 球面镶嵌实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import { PLATONIC_INFO } from '../platonic-solids/platonicSolids'
import {
  totalArea, areaBalanceError, faceArea, faceFraction, edgeArcLengths,
  edgesEquilateral, faceInteriorAngle, planarInteriorAngle,
  vertexAngularDefect, schlafliDiscriminant, geometryOf,
  TILING_INFO, GEOMETRY_EXAMPLES, type TilingKind,
} from './sphericalTiling'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  kind: TilingKind
  onKind: (k: TilingKind) => void
}

export default function SidePanel({ kind, onKind }: SidePanelProps) {
  const info = TILING_INFO.find((t) => t.kind === kind)!
  const p = PLATONIC_INFO.find((x) => x.kind === kind)!
  const sphericalAng = faceInteriorAngle(kind, 0)
  const planarAng = planarInteriorAngle(p.faceSides)
  const disc = schlafliDiscriminant(p.vertexFaces, p.faceSides)
  const defect = vertexAngularDefect(kind)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">五种正规球面镶嵌</h3>
        <div className="space-y-2">
          {TILING_INFO.map((t) => (
            <button
              key={t.kind}
              onClick={() => onKind(t.kind)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${kind === t.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div className="flex justify-between">
                <span>{t.schlafli}</span>
                <span className="text-xs opacity-70">{t.F} 面</span>
              </div>
              <div className="text-xs opacity-70 mt-0.5">{t.note}</div>
            </button>
          ))}
        </div>
      </div>

      <CurveFactsCard
        title="面积配平与判别式"
        rows={[
          ['总面积', totalArea(kind).toFixed(6), `4π = ${(4 * Math.PI).toFixed(6)}`],
          ['配平相对误差', areaBalanceError(kind).toExponential(1), '应为 0'],
          ['单面面积', faceArea(kind, 0).toFixed(6), `4π/F = ${((4 * Math.PI) / info.F).toFixed(6)}`],
          ['单面占比', `${(faceFraction(kind, 0) * 100).toFixed(3)}%`, `1/F = ${(100 / info.F).toFixed(3)}%`],
          ['棱弧长', `${(edgeArcLengths(kind)[0] * DEG).toFixed(3)}°`, edgesEquilateral(kind) ? '全等长' : '不等长'],
          ['球面内角', `${(sphericalAng * DEG).toFixed(2)}°`, `平面同边形 ${(planarAng * DEG).toFixed(2)}°`],
          ['顶点面角和', `${(p.vertexFaces * sphericalAng * DEG).toFixed(2)}°`, '球面上恰为 360°'],
          ['展开角亏', `${(defect * DEG).toFixed(2)}°`, `总和 ${(info.V * defect * DEG).toFixed(0)}° = 4π`],
          ['(p−2)(q−2)', String(disc), `< 4 → ${geometryOf(p.vertexFaces, p.faceSides)}几何`],
        ]}
        facts={[
          ['面积必须配平到 4π', '：这是检验镶嵌数据自洽的强判据。'],
          ['球面内角大于平面内角', '，所以展开时角亏为正，能围成闭曲面。'],
          ['同一不等式划分三种几何', `：${GEOMETRY_EXAMPLES.map((g) => g.label.split(' ')[0]).slice(0, 3).join('/')} 分属球面/平面/双曲。`],
          ['球面只有 5 种', '，平面 3 种，双曲无穷多种。'],
        ]}
      />
    </div>
  )
}
