import { useState, useEffect } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { supertoroidNarration } from '../../narrations/scripts/supertoroid'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import Surface3DPlot from '../../lib/Surface3DPlot'
import { supertoroid, U_RANGE, V_RANGE, PRESETS } from './supertoroid'

// 知识卡条目。抽成常量而不是内联 JSX, 免得组件超过 100 行
const FACTS = [
  ['e1 管俯视轮廓', '，e2 管管截面；调小变方，e2=2 变菱形截面。'],
  ['亏格恒为 1', '，欧拉示性数 χ = 2 − 2g = 0，与两个指数都无关。'],
  ['z 范围恒为 ±r', '，两个指数都改不了竖直方向的高度。'],
  ['咖啡杯与甜甜圈', ' 拓扑上一样，因为都只有一个洞。'],
]

export default function SupertoroidExperiment() {
  const [e1, setE1] = useState(1)
  const [e2, setE2] = useState(1)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(supertoroidNarration)
  }, [narration])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">超环面族</h1>
            <p className="text-gray-600">形状千变而拓扑不动</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">3D 视图（可拖动旋转）</h3>
            <Surface3DPlot
              fn={(u, v) => supertoroid(u, v, e1, e2)}
              uRange={U_RANGE}
              vRange={V_RANGE}
              colorscale="YlGnBu"
              deps={[e1, e2]}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数调节</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                环走向指数 e1：{e1.toFixed(2)}
              </label>
              <input
                type="range" min={0.1} max={3} step={0.05}
                value={e1} onChange={(e) => setE1(Number(e.target.value))}
                className="w-full" aria-label="环走向指数 e1"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                管截面指数 e2：{e2.toFixed(2)}
              </label>
              <input
                type="range" min={0.1} max={3} step={0.05}
                value={e2} onChange={(e) => setE2(Number(e.target.value))}
                className="w-full" aria-label="管截面指数 e2"
              />
              <div className="mt-4 space-y-2">
                {PRESETS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => { setE1(s.e1); setE2(s.e2); }}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  >
                    <span>{s.label}</span><span className="text-xs opacity-70">{s.note}</span>
                  </button>
                ))}
              </div>
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
        </div>
      </div>
    </>
  )
}
