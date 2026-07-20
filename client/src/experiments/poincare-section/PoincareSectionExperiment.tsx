import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { poincareSectionNarration } from '../../narrations/scripts/poincare-section'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PARAM_SETS, SET_NAMES } from './poincareSection'
import { drawPoincareSection } from './draw'

const W = 600
const H = 480

const SET_LABEL: Record<string, string> = {
  periodic: '周期解（少数点）',
  chaotic: '混沌解（分形点云）',
}
const STEP_OPTIONS = [500, 1500, 3000]

export default function PoincareSectionExperiment() {
  const [set, setSet] = useState('chaotic')
  const [steps, setSteps] = useState(1500)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(poincareSectionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const params = PARAM_SETS[set] || PARAM_SETS.chaotic
    const color = set === 'periodic' ? '#34d399' : '#f472b6'
    drawPoincareSection(canvas, params, steps, color)
  }, [set, steps])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">庞加莱截面</h1>
            <p className="text-gray-600">高维轨迹压成点图</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{SET_LABEL[set]} · {steps} 个采样点</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数组</h3>
              <div className="space-y-2">
                {SET_NAMES.map((name) => (
                  <button
                    key={name}
                    onClick={() => setSet(name)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${set === name ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {SET_LABEL[name]}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">采样周期数</h3>
              <div className="space-y-2">
                {STEP_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSteps(s)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${steps === s ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {s} 个周期
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 内核用 <b>RK4</b> 积分受迫 Duffing 振子，每个驱动周期<b>频闪</b>采一点。</li>
                <li>• 周期解在截面上只留下<b>少数几个点</b>。</li>
                <li>• 混沌解的点永不重复，铺成<b>分形点云</b>。</li>
                <li>• 这是庞加莱降维读懂混沌的经典利器。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
