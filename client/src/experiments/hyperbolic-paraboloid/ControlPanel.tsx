/**
 * 双曲抛物面实验页的参数面板
 *
 * 从 Experiment 里抽出来, 让主组件保持在 100 行以内。
 */
import { gaussianCurvature, PRESETS } from './hyperbolicParaboloid'

// 知识卡条目
const FACTS: Array<[string, string]> = [
  ['K < 0 处处成立', '，每一点都是鞍点，没有碗形的地方。'],
  ['双直纹面', '：能被两族直线完全铺满，每点恰有两条直线穿过。'],
  ['x=a(s+t), y=b(s−t), z=4st', '，固定一个参数就得到一次函数，即直线。'],
  ['弯屋顶用直梁搭', '，两族钢梁交叉即成优雅曲面，无需定制弯曲构件。'],
]

export interface ControlPanelProps {
  a: number
  b: number
  family1: boolean
  family2: boolean
  onA: (v: number) => void
  onB: (v: number) => void
  onFamily1: () => void
  onFamily2: () => void
  onPreset: (a: number, b: number) => void
}

export default function ControlPanel(p: ControlPanelProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">系数 a：{p.a.toFixed(2)}</h3>
        <input
          type="range" min={0.5} max={1.8} step={0.02} value={p.a}
          onChange={(e) => p.onA(Number(e.target.value))}
          className="w-full" aria-label="系数 a"
        />
        <h3 className="text-lg font-semibold mb-3 mt-3">系数 b：{p.b.toFixed(2)}</h3>
        <input
          type="range" min={0.5} max={1.8} step={0.02} value={p.b}
          onChange={(e) => p.onB(Number(e.target.value))}
          className="w-full" aria-label="系数 b"
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={p.onFamily1}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${p.family1 ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-100 text-gray-600'}`}
          >
            第一族
          </button>
          <button
            onClick={p.onFamily2}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${p.family2 ? 'bg-cyan-300 text-cyan-900' : 'bg-gray-100 text-gray-600'}`}
          >
            第二族
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {PRESETS.map((s) => (
            <button
              key={s.label}
              onClick={() => p.onPreset(s.a, s.b)}
              className="w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              <span>{s.label}</span><span className="text-xs opacity-70">{s.note}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">实时验证</h3>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li>• 原点高斯曲率 <b>{gaussianCurvature(0, 0, p.a, p.b).toFixed(3)}</b>（恒为负）</li>
          <li>• 远处 (1,1) 处 <b>{gaussianCurvature(1, 1, p.a, p.b).toFixed(3)}</b>（仍为负）</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">概念与趣闻</h3>
        <ul className="text-sm text-gray-600 space-y-1.5">
          {FACTS.map(([head, tail]) => (
            <li key={head}>• <b>{head}</b>{tail}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
