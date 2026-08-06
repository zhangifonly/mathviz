import CurveFactsCard from '../../lib/CurveFactsCard'
import type { Mode } from './draw'
import {
  PRESETS, angleBetweenQuats, eulerLerp, fromEuler, pathStats, slerp,
  toAxisAngle, type Preset,
} from './quaternionRotation'

export interface SidePanelProps {
  presetId: string
  t: number
  mode: Mode
  camYaw: number
  camPitch: number
  showTrail: boolean
  playing: boolean
  onPreset: (id: string) => void
  onT: (v: number) => void
  onMode: (m: Mode) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleTrail: () => void
  onTogglePlay: () => void
}

const deg = (r: number) => ((r * 180) / Math.PI).toFixed(4)
const MODES: Array<[Mode, string]> = [
  ['compare', '并排对照'],
  ['single', '只看四元数'],
]

export default function SidePanel({
  presetId, t, mode, camYaw, camPitch, showTrail, playing,
  onPreset, onT, onMode, onCamYaw, onCamPitch, onToggleTrail, onTogglePlay,
}: SidePanelProps) {
  const preset: Preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]
  const qa = fromEuler(preset.from.yaw, preset.from.pitch, preset.from.roll)
  const qb = fromEuler(preset.to.yaw, preset.to.pitch, preset.to.roll)
  const q = slerp(qa, qb, t)
  const aa = toAxisAngle(q)
  const s = pathStats((u) => slerp(qa, qb, u), 48)
  const e = pathStats((u) => eulerLerp(preset.from, preset.to, u), 48)

  const rows: Array<[string, string, string?]> = [
    ['当前 q', q.map((v) => v.toFixed(5)).join(', '), '(w, x, y, z)'],
    ['等效转角', `${deg(aa.angle)}°`],
    ['两姿态夹角', `${deg(angleBetweenQuats(qa, qb))}°`, '最短路径的长度'],
    ['SLERP 总转角', `${deg(s.total)}°`, '等于最短路径'],
    ['欧拉插值总转角', `${deg(e.total)}°`, `多走 ${((e.total / s.total - 1) * 100).toFixed(1)}%`],
    ['SLERP 每步 max/min', s.ratio.toFixed(6), '应为 1（匀速）'],
    ['欧拉插值 max/min', e.ratio.toFixed(6), '大于 1 即不匀'],
  ]

  const facts: Array<[string, string]> = [
    ['单位四元数编码旋转：', '绕轴 n 转 θ 对应 q = (cos(θ/2), sin(θ/2)·n)，作用方式是 v′ = q v q⁻¹。'],
    ['为什么是半角？', '共轭作用里 q 用了两次，一次左乘一次右乘，半角正好补回来，不是凑的。'],
    ['双重覆盖：', 'q 与 −q 是同一个旋转（负号在共轭里相消）。所以转 360° 得到 −1，转 720° 才回到 1。'],
    ['工程上换用它的真正理由：', '不只是躲万向锁，而是 SLERP 给出匀速的、最短路径的姿态插值。'],
    ['两个指标各测一种毛病：', '「max/min」测快慢匀不匀，「总转角」测路冤不冤。万向锁那个预设里欧拉插值匀速却绕了 343°，只看前者会漏掉。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">选择两端姿态</h3>
        <div className="space-y-1.5">
          {PRESETS.map((p) => {
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

        <h4 className="text-sm font-semibold text-gray-700 mt-4 mb-2">显示模式</h4>
        <div className="grid grid-cols-2 gap-2">
          {MODES.map(([id, label]) => (
            <button
              key={id}
              onClick={() => onMode(id)}
              className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                mode === id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-1">
            插值参数 t = {t.toFixed(3)}
          </label>
          <input
            type="range" min={0} max={1} step={0.001} value={t}
            onChange={(ev) => onT(Number(ev.target.value))}
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

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onToggleTrail}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              showTrail ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showTrail ? '✓ ' : ''}轨迹
          </button>
          <button
            onClick={onTogglePlay}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              playing ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {playing ? '⏸ 暂停' : '▶ 播放'}
          </button>
        </div>
      </div>

      <CurveFactsCard title="插值的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">它被用在哪里</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><b className="text-gray-800">游戏与动画</b>：骨骼关键帧之间的姿态过渡，几乎一律用 SLERP。</li>
          <li><b className="text-gray-800">姿态解算</b>：无人机、手机的 IMU 融合在四元数上做，没有万向锁。</li>
          <li><b className="text-gray-800">航天器</b>：姿态控制用四元数存储，避免欧拉角在极点附近的病态。</li>
          <li><b className="text-gray-800">机器人学</b>：机械臂末端姿态规划，需要匀速且最短的旋转路径。</li>
        </ul>
      </div>
    </div>
  )
}
