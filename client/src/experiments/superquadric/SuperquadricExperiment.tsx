import { useState, useEffect } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { superquadricNarration } from '../../narrations/scripts/superquadric'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import Surface3DPlot from '../../lib/Surface3DPlot'
import { superquadric, U_RANGE, V_RANGE, PRESETS } from './superquadric'

// 知识卡条目。抽成常量而不是内联 JSX, 免得组件超过 100 行
const FACTS = [
  ['n1 = n2 = 1', ' 是标准椭球；趋于 0 变立方体；等于 2 变八面体；大于 3 变星形。'],
  ['带符号幂', ' 是关键：负数取分数次幂需先取绝对值再乘回符号，否则曲面不闭合。'],
  ['体积可验证', '：指数为 1 时得 4π/3，趋 0 时得 8，等于 2 时得 4/3，与理论吻合。'],
  ['Barr 1981', ' 引入计算机图形学，两个数字覆盖从方到圆到星的连续谱。'],
]

export default function SuperquadricExperiment() {
  const [n1, setN1] = useState(1)
  const [n2, setN2] = useState(1)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(superquadricNarration)
  }, [narration])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">超二次曲面</h1>
            <p className="text-gray-600">两个指数生成一族立体</p>
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
              fn={(u, v) => superquadric(u, v, n1, n2)}
              uRange={U_RANGE}
              vRange={V_RANGE}
              colorscale="Plasma"
              deps={[n1, n2]}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数调节</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                纵向指数 n1：{n1.toFixed(2)}
              </label>
              <input
                type="range" min={0.1} max={4} step={0.05}
                value={n1} onChange={(e) => setN1(Number(e.target.value))}
                className="w-full" aria-label="纵向指数 n1"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                横向指数 n2：{n2.toFixed(2)}
              </label>
              <input
                type="range" min={0.1} max={4} step={0.05}
                value={n2} onChange={(e) => setN2(Number(e.target.value))}
                className="w-full" aria-label="横向指数 n2"
              />
              <div className="mt-4 space-y-2">
                {PRESETS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => { setN1(s.n1); setN2(s.n2); }}
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
