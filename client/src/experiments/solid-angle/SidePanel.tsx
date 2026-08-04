/**
 * 立体角实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  triangleSolidAngle, solidAngleByExcess, solidAngleResidual, coneSolidAngle,
  coneAngleFromSolid, solidFraction, tetrahedronVertexSolidAngle,
  FULL_SPACE, CUBE_VERTEX_SOLID_ANGLE, CUBE_VERTEX_SUM, PRESETS, ANALOGY,
  type PresetId,
} from './solidAngle'
import type { Vec3 } from '../../lib/proj3d'

const DEG = 180 / Math.PI

export interface SidePanelProps {
  presetId: PresetId
  showCone: boolean
  onPreset: (id: PresetId) => void
  onToggleCone: () => void
  a: Vec3
  b: Vec3
  c: Vec3
}

export default function SidePanel(props: SidePanelProps) {
  const { presetId, showCone, onPreset, onToggleCone, a, b, c } = props
  const omega = triangleSolidAngle(a, b, c)
  const alpha = coneAngleFromSolid(omega)
  const tetraSum = 4 * tetrahedronVertexSolidAngle()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择三条射线</h3>
        <div className="space-y-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onPreset(p.id)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${presetId === p.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <div>{p.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{p.note}</div>
            </button>
          ))}
        </div>
        <button
          onClick={onToggleCone}
          className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${showCone ? 'bg-violet-400 text-violet-900' : 'bg-gray-100 text-gray-600'}`}
        >
          {showCone ? '✓ 显示同立体角的圆锥' : '显示同立体角的圆锥'}
        </button>
        <div className="mt-3 text-xs text-gray-500 space-y-1">
          {ANALOGY.map((x) => (
            <div key={x.dim}>
              {x.dim}：{x.formula}，整个 = {x.full} {x.unit}
            </div>
          ))}
        </div>
      </div>

      <CurveFactsCard
        title="立体角读数"
        rows={[
          ['公式法 Ω', `${omega.toFixed(6)} sr`],
          ['球面盈余法', `${solidAngleByExcess(a, b, c).toFixed(6)} sr`, '独立算法'],
          ['两法残差', solidAngleResidual(a, b, c).toExponential(1), '应为 0'],
          ['占全空间', `${(solidFraction(omega) * 100).toFixed(3)}%`, `全空间 ${FULL_SPACE.toFixed(4)} sr`],
          ['等效圆锥半顶角', `${(alpha * DEG).toFixed(2)}°`],
          ['圆锥公式回代', `${coneSolidAngle(alpha).toFixed(6)} sr`, '与 Ω 相同'],
          ['立方体顶点 Ω', `${CUBE_VERTEX_SOLID_ANGLE.toFixed(4)} sr`, '= π/2'],
          ['立方体八顶点和', `${CUBE_VERTEX_SUM.toFixed(4)} sr`, '恰为 4π'],
          ['正四面体四顶点和', `${tetraSum.toFixed(4)} sr`, `≠ 4π（差 ${(FULL_SPACE - tetraSum).toFixed(2)}）`],
        ]}
        facts={[
          ['立体角 = 球面面积 / r²', '，全空间 4π 球面度，与平面角的 2π 弧度对应。'],
          ['公式的分子是三重积', '：与四面体体积用的是同一个量。'],
          ['球面盈余法给出同一个数', '：立体角就是单位球面上那片三角形的面积。'],
          ['立方体八顶点和恰为 4π 是巧合', '：正四面体四顶点和只有 2.2，不是普适规律。'],
        ]}
      />
    </div>
  )
}
