import { useState, useEffect } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { crossCapNarration } from '../../narrations/scripts/cross-cap'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import Surface3DPlot from '../../lib/Surface3DPlot'
import { crossCap, U_RANGE, V_RANGE, PRESETS } from './crossCap'

// 知识卡条目。抽成常量而不是内联 JSX, 免得组件超过 100 行
const FACTS = [
  ['对径点粘合', '：圆盘边界每对正对着的点两两粘合，得到射影平面。'],
  ['1 条自交线, 2 个分支点', '，这是三维空间实现射影平面的最小代价。'],
  ['只能浸入不能嵌入', '，射影平面无法无自交地放进三维空间。'],
  ['χ = 1', ' 是奇数，说明它不可定向。'],
]

export default function CrossCapExperiment() {
  const [height, setHeight] = useState(1)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(crossCapNarration)
  }, [narration])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">交叉帽</h1>
            <p className="text-gray-600">射影平面最简单的浸入</p>
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
              fn={(u, v) => crossCap(u, v, height)}
              uRange={U_RANGE}
              vRange={V_RANGE}
              colorscale="RdBu"
              deps={[height]}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数调节</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                纵向拉伸：{height.toFixed(2)}
              </label>
              <input
                type="range" min={0.4} max={2} step={0.02}
                value={height} onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full" aria-label="纵向拉伸"
              />
              <div className="mt-4 space-y-2">
                {PRESETS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => { setHeight(s.height); }}
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
