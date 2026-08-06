import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  applyMotion, chaslesDecompose, cross, distanceToAxis, dot, makeMotion,
  motionDiff, norm, pitchPerTurn, scale, screwToMotion, sub,
  type Preset, type Vec3,
} from './screwMotion'

export interface SidePanelProps {
  presetId: string
  u: number
  camYaw: number
  camPitch: number
  showTrails: boolean
  showDecomp: boolean
  playing: boolean
  presets: Preset[]
  onPreset: (id: string) => void
  onU: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleTrails: () => void
  onToggleDecomp: () => void
  onTogglePlay: () => void
}

const sci = (v: number) => v.toExponential(2).replace('e+0', 'e+').replace('e-0', 'e-')

export default function SidePanel({
  presetId, u, camYaw, camPitch, showTrails, showDecomp, playing, presets,
  onPreset, onU, onCamYaw, onCamPitch, onToggleTrails, onToggleDecomp, onTogglePlay,
}: SidePanelProps) {
  const preset = presets.find((p) => p.id === presetId) ?? presets[0]
  const motion = makeMotion(preset.axis as Vec3, preset.theta, preset.t as Vec3)
  const s = chaslesDecompose(motion)
  const back = motionDiff(motion, screwToMotion(s))
  const perp = norm(sub(preset.t as Vec3, scale(s.axis, dot(preset.t as Vec3, s.axis))))
  const pitch = pitchPerTurn(s)

  // 轴上点的位移应完全沿轴：垂直分量为 0
  const moved = applyMotion(motion, s.point)
  const disp = sub(moved, s.point)
  const offAxis = norm(cross(disp, s.axis))

  const rows: Array<[string, string, string?]> = [
    ['转角 θ', `${((s.theta * 180) / Math.PI).toFixed(3)}°`],
    ['螺距 d（沿轴）', s.d.toFixed(8), '= t·ω̂，消不掉'],
    ['垂直分量', perp.toFixed(8), '靠挪轴消掉'],
    ['螺旋轴过点', s.point.map((v) => v.toFixed(4)).join(', ')],
    ['轴到原点距离', norm(s.point).toFixed(6), '一般不过原点'],
    ['每转一圈前进', Number.isFinite(pitch) ? pitch.toFixed(6) : '∞'],
    ['轴上点位移的垂直分量', sci(offAxis), '应为 0'],
    ['分解重建误差（旋转）', sci(back.rot), '应为 0'],
    ['分解重建误差（平移）', sci(back.trans), '应为 0'],
    ['当前 u', u.toFixed(3), `到轴距离 ${distanceToAxis(s, [0.6, 0, 0.7]).toFixed(3)}`],
  ]

  const facts: Array<[string, string]> = [
    ['Chasles 定理：', '任何刚体运动 = 绕某条轴转 θ + 沿同一条轴移 d。一个螺旋，不多不少。'],
    ['为什么能这样：', '把平移拆成沿轴与垂直两部分。沿轴那部分消不掉，就是螺距；垂直那部分靠把轴平移到合适位置消掉。'],
    ['轴怎么找：', '解 (I−R)c = t⊥。这个方程在 ℝ³ 上无解（I−R 奇异），但限制到垂直于轴的平面就可逆。'],
    ['轴上的点最特别：', '它们只沿轴平移、不绕转，轨迹是直线段。其余的点都走螺旋线。'],
    ['θ→0 时轴跑向无穷：', '公式里的 cot(θ/2) 发散不是 bug，正对应「纯平移可以看成绕无穷远轴的旋转」。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择刚体运动</h3>
        <div className="space-y-1.5">
          {presets.map((p) => {
            const active = p.id === presetId
            return (
              <button
                key={p.id}
                onClick={() => onPreset(p.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center gap-2 ${
                  active ? 'bg-indigo-600 text-white font-medium' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="shrink-0">{p.label}</span>
                <span className={`text-xs text-right ${active ? 'text-indigo-100' : 'text-gray-400'}`}>{p.note}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-1">
            沿螺旋走到 u = {u.toFixed(3)}
          </label>
          <input
            type="range" min={0} max={1} step={0.001} value={u}
            onChange={(ev) => onU(Number(ev.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角水平 {(camYaw * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={0} max={Math.PI * 2} step={0.01} value={camYaw}
              onChange={(ev) => onCamYaw(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">视角俯仰 {(camPitch * 180 / Math.PI).toFixed(0)}°</label>
            <input type="range" min={-1.2} max={1.2} step={0.01} value={camPitch}
              onChange={(ev) => onCamPitch(Number(ev.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={onToggleTrails}
            className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
              showTrails ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showTrails ? '✓ ' : ''}螺旋线
          </button>
          <button
            onClick={onToggleDecomp}
            className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
              showDecomp ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showDecomp ? '✓ ' : ''}t 的分解
          </button>
          <button
            onClick={onTogglePlay}
            className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
              playing ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {playing ? '⏸ 暂停' : '▶ 播放'}
          </button>
        </div>
      </div>

      <CurveFactsCard title="螺旋分解的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">用在哪里</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">机器人学</b>：旋量与指数积公式，上一课提到的「每个关节一个旋量」说的就是它。</li>
          <li><b className="text-gray-800">运动插补</b>：起止位姿之间按螺旋走，比分别插旋转和平移更自然、路径更短。</li>
          <li><b className="text-gray-800">机构学</b>：螺旋副（丝杠）是唯一同时约束转与移的运动副，本质就是固定螺距的螺旋运动。</li>
          <li><b className="text-gray-800">分子生物学</b>：DNA 双螺旋的对称性正是一个螺旋运动群。</li>
        </ul>
      </div>
    </div>
  )
}
