/**
 * 柏拉图立体实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import { eulerCount, isEquilateral, isSpherical } from '../../lib/polyhedron'
import {
  platonicOf, angleCondition, enumerateSolutions, angularDefect, infoOf,
  PLATONIC_INFO, type PlatonicKind,
} from './platonicSolids'

export interface SidePanelProps {
  kind: PlatonicKind
  showDual: boolean
  onPick: (k: PlatonicKind) => void
  onToggleDual: () => void
}

export default function SidePanel({
  kind, showDual, onPick, onToggleDual,
}: SidePanelProps) {
  const info = infoOf(kind)
  const p = platonicOf(kind)
  const c = eulerCount(p)
  const defect = angularDefect(info.vertexFaces, info.faceSides)
  const solCount = enumerateSolutions(12).length

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">五种正多面体</h3>
        <div className="space-y-2">
          {PLATONIC_INFO.map((i) => (
            <button
              key={i.kind}
              onClick={() => onPick(i.kind)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${kind === i.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <span>{i.label}</span>
              <span className="text-xs opacity-70">{i.V}/{i.E}/{i.F}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onToggleDual}
          className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${showDual ? 'bg-sky-400 text-sky-900' : 'bg-gray-100 text-gray-600'}`}
        >
          {showDual ? `✓ 叠加对偶（${infoOf(info.dual).label}）` : '叠加显示对偶多面体'}
        </button>
      </div>

      <CurveFactsCard
        title="验证与不变量"
        rows={[
          ['V − E + F =', String(c.chi), '欧拉公式要求为 2'],
          ['V / E / F =', `${c.V} / ${c.E} / ${c.F}`],
          ['(p−2)(q−2) =', String(angleCondition(info.vertexFaces, info.faceSides)), '须 < 4'],
          ['每顶点角亏', `${defect.toFixed(1)}°`],
          ['角亏总和', `${(c.V * defect).toFixed(0)}°`, '笛卡尔定理: 恒为 720°'],
          ['等棱 / 共球', `${isEquilateral(p) ? '✓' : '✗'} / ${isSpherical(p) ? '✓' : '✗'}`],
        ]}
        facts={[
          ['恰好五种', `：满足 (p−2)(q−2) < 4 的整数解只有 ${solCount} 组。`],
          ['对偶', `：${info.label} ↔ ${infoOf(info.dual).label}，交换 V 与 F。`],
          ['(3,6) 与 (4,4)', ' 恰好等于 4，角亏为零，铺满平面而非围成立体。'],
        ]}
      />
    </div>
  )
}
