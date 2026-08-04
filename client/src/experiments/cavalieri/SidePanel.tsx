/**
 * Cavalieri 实验的右侧面板
 */
import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  sceneOf, SCENE_IDS, profileMismatch, integrateVolume, volumeResidual,
  sphereVolume, archimedesRatio, TIMELINE, type SceneId,
} from './cavalieri'

export interface SidePanelProps {
  sceneId: SceneId
  h: number
  exploded: boolean
  onScene: (id: SceneId) => void
  onH: (v: number) => void
  onToggleExploded: () => void
}

export default function SidePanel(props: SidePanelProps) {
  const { sceneId, h, exploded, onScene, onH, onToggleExploded } = props
  const sc = sceneOf(sceneId, 1)
  const al = sc.left.areaAt(h)
  const ar = sc.right.areaAt(h)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择场景</h3>
        <div className="space-y-2">
          {SCENE_IDS.map((id) => {
            const s = sceneOf(id, 1)
            return (
              <button
                key={id}
                onClick={() => onScene(id)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${sceneId === id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
              >
                <div>{s.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{s.claim}</div>
              </button>
            )
          })}
        </div>

        <label className="block mt-4 text-sm font-medium text-gray-700">
          截面高度 h = {h.toFixed(4)}
        </label>
        <input
          type="range" min={0} max={sc.left.height}
          step={sc.left.height / 200} value={h}
          onChange={(e) => onH(Number(e.target.value))}
          className="w-full mt-1"
        />
        <button
          onClick={onToggleExploded}
          className={`w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium ${exploded ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-600'}`}
        >
          {exploded ? '✓ 拆成薄片' : '拆成薄片'}
        </button>
      </div>

      <CurveFactsCard
        title="截面与体积"
        rows={[
          ['左：截面积', al.toFixed(6), sc.left.label],
          ['右：截面积', ar.toFixed(6), sc.right.label],
          ['两者之差', Math.abs(al - ar).toExponential(1), '应为 0'],
          ['全程最大偏差', profileMismatch(sc.left, sc.right, 400).toExponential(1)],
          ['左：体积', sc.left.volume.toFixed(8)],
          ['右：体积', sc.right.volume.toFixed(8)],
          ['数值积分（左）', integrateVolume(sc.left, 5000).toFixed(8)],
          ['积分误差', volumeResidual(sc.left, 5000).toExponential(1)],
        ]}
        facts={[
          ['截面积处处相等 ⟹ 体积相等', '，这就是 Cavalieri 原理。'],
          ['棱锥的 1/3 由此而来', '：截面按 (1−h/H)² 收缩，积分给出 1/3。'],
          ['阿基米德用它算球体积', '：半球与「圆柱挖去圆锥」截面处处相同。'],
          [`球 : 外接圆柱 = ${archimedesRatio(1).toFixed(4)} = 2/3`,
            `，球体积 ${sphereVolume(1).toFixed(6)}，他为此刻在墓碑上。`],
        ]}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold mb-2">年表</h3>
        <div className="space-y-1 text-xs">
          {TIMELINE.map((t) => (
            <div key={t.year} className="flex gap-2">
              <span className="text-gray-400 font-mono shrink-0 w-14">
                {t.year < 0 ? `前${-t.year}` : t.year}
              </span>
              <span className="text-gray-600">{t.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
