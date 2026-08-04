/**
 * 对偶多面体实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  dualOf, midsphereRadius, midsphereSpread, edgePerpendicularity,
  eulerCharacteristic, vef, dualName, norm, sub,
  PLATONIC, type Polyhedron, type SolidId,
} from './dualPolyhedra'

export interface SidePanelProps {
  solid: Polyhedron
  solidId: SolidId
  showDual: boolean
  showMid: boolean
  fillFaces: boolean
  onSolid: (id: SolidId) => void
  onToggleDual: () => void
  onToggleMid: () => void
  onToggleFill: () => void
}

export default function SidePanel(props: SidePanelProps) {
  const {
    solid, solidId, showDual, showMid, fillFaces,
    onSolid, onToggleDual, onToggleMid, onToggleFill,
  } = props
  const R = midsphereRadius(solid)
  const D = dualOf(solid, R)
  const [V, E, F] = vef(solid)
  const [dv, de, df] = vef(D)
  // 对偶的对偶，验证回到自己
  const DD = dualOf(D, R)
  let backErr = 0
  if (DD.vertices.length === solid.vertices.length) {
    for (let i = 0; i < solid.vertices.length; i++) {
      backErr = Math.max(
        backErr, norm(sub(DD.vertices[i], solid.vertices[i])) / (norm(solid.vertices[i]) || 1),
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择柏拉图立体</h3>
        <div className="space-y-2">
          {PLATONIC.map((p) => (
            <button
              key={p.id}
              onClick={() => onSolid(p.id as SolidId)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${solidId === p.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div className="flex justify-between">
                <span>{p.label}</span>
                <span className="text-xs opacity-70">
                  ↔ {PLATONIC.find((q) => q.id === dualName(p.id as SolidId))?.label ?? ''}
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={onToggleDual}
            className={`px-2 py-2 rounded-lg text-xs font-medium ${showDual ? 'bg-orange-400 text-orange-900' : 'bg-gray-100 text-gray-600'}`}
          >
            {showDual ? '✓ 对偶' : '对偶'}
          </button>
          <button
            onClick={onToggleMid}
            className={`px-2 py-2 rounded-lg text-xs font-medium ${showMid ? 'bg-slate-400 text-slate-900' : 'bg-gray-100 text-gray-600'}`}
          >
            {showMid ? '✓ 中球' : '中球'}
          </button>
          <button
            onClick={onToggleFill}
            className={`px-2 py-2 rounded-lg text-xs font-medium ${fillFaces ? 'bg-blue-400 text-blue-900' : 'bg-gray-100 text-gray-600'}`}
          >
            {fillFaces ? '✓ 面' : '面'}
          </button>
        </div>
      </div>

      <CurveFactsCard
        title="对偶的读数"
        rows={[
          ['原 (V, E, F)', `(${V}, ${E}, ${F})`],
          ['对偶 (V, E, F)', `(${dv}, ${de}, ${df})`, 'V 与 F 互换'],
          ['欧拉数 χ', `${eulerCharacteristic(solid)} / ${eulerCharacteristic(D)}`, '都是 2'],
          ['中球半径 R', R.toFixed(6)],
          ['中球极差', midsphereSpread(solid).toExponential(1), '应为 0'],
          ['对偶棱⊥原棱 max|cos|', edgePerpendicularity(solid, R).toExponential(1), '应为 0'],
          ['对偶的对偶偏差', backErr.toExponential(1), '回到自己'],
          ['配对', `${solid.label} ↔ ${PLATONIC.find((q) => q.id === dualName(solidId))?.label ?? ''}`],
        ]}
        facts={[
          ['面变顶点、顶点变面，棱数不变', '，所以 χ = V−E+F 两边都是 2。'],
          ['极反演: 顶点在面法向上距原点 R²/d', '，面越近对偶顶点越远。'],
          ['对偶棱与原棱垂直', '，取 R = 中球半径时两者互相卡住。'],
          ['正四面体自对偶', '；立方体↔八面体，十二面体↔二十面体。'],
        ]}
      />
    </div>
  )
}
