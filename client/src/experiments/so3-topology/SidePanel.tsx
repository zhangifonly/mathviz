import CurveFactsCard from '../../lib/CurveFactsCard'
import {
  classAdd, homotopyClass, isContractible, liftPath, projectedLift,
  quatAxisAngle, type Preset,
} from './so3Topology'

export interface SidePanelProps {
  turns: number
  t: number
  camYaw: number
  camPitch: number
  liftOnly: boolean
  playing: boolean
  presets: Preset[]
  onTurns: (v: number) => void
  onT: (v: number) => void
  onCamYaw: (v: number) => void
  onCamPitch: (v: number) => void
  onToggleLiftOnly: () => void
  onTogglePlay: () => void
}

export default function SidePanel({
  turns, t, camYaw, camPitch, liftOnly, playing, presets,
  onTurns, onT, onCamYaw, onCamPitch, onToggleLiftOnly, onTogglePlay,
}: SidePanelProps) {
  const path = liftPath(turns, [0, 0, 1], 240)
  const end = path[path.length - 1].q
  const cur = quatAxisAngle([0, 0, 1], t * turns * Math.PI * 2)
  const segs = projectedLift(turns)
  const contractible = isContractible(turns)

  const rows: Array<[string, string, string?]> = [
    ['转过', `${(turns * 360).toFixed(0)}°`, `${turns} 圈`],
    ['当前提升 q', cur.map((v) => v.toFixed(4)).join(', '), '(w, x, y, z)'],
    ['提升终点 w', end[0].toFixed(8), contractible ? '= +1，闭合' : '= −1，不闭合'],
    ['同伦类', `[${homotopyClass(turns)}]`, contractible ? '平凡元' : '生成元'],
    ['能否收缩', contractible ? '能' : '不能'],
    ['投影曲线段数', String(segs.length), '每穿过一次 −1 断一次'],
  ]

  const facts: Array<[string, string]> = [
    ['环路的提升：', '绕轴转 turns 圈，在 S³ 上的提升从 1 出发，终点是 (−1)^turns。'],
    ['为什么这决定一切：', 'S³ 单连通，SO(3) 里的环路能否收缩，只取决于提升闭不闭合。'],
    ['于是只有两类：', '偶数圈平凡、奇数圈非平凡，相加模 2 —— 这就是 π₁(SO(3)) = ℤ₂。'],
    ['非平凡元是自己的逆：', '两次 360° 接起来就是 720°，而 720° 可以收缩。'],
    ['物理上叫旋量：', '电子转一圈波函数变号，转两圈才复原。腰带把戏演示的是同一件事。'],
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">转几圈</h3>
        <div className="space-y-1.5">
          {presets.map((p) => {
            const active = p.turns === turns
            return (
              <button
                key={p.id}
                onClick={() => onTurns(p.turns)}
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
            沿环路走到 t = {t.toFixed(3)}
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
            onClick={onToggleLiftOnly}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              liftOnly ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {liftOnly ? '✓ ' : ''}只看提升
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

      <CurveFactsCard title="提升的读数" rows={rows} facts={facts} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">ℤ₂ 的加法表</h3>
        <table className="text-sm text-gray-700 w-full">
          <tbody>
            {[0, 1].map((a) => (
              <tr key={a}>
                {[0, 1].map((b) => (
                  <td key={b} className="px-2 py-1.5 border border-gray-100 text-center">
                    [{a}] + [{b}] = <b>[{classAdd(a, b)}]</b>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">
          [1]+[1]=[0]：两次 360° 接起来是 720°，可以收缩。所以非平凡元素是自己的逆，
          这个群只能是 ℤ₂。
        </p>
      </div>
    </div>
  )
}
