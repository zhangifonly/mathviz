import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { dampedOscillationNarration } from '../../narrations/scripts/damped-oscillation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ZETA_VALUES, dampingType } from './dampedOscillation'
import { drawDampedOscillation } from './draw'

const W = 600
const H = 480

const TYPE_LABEL: Record<string, string> = {
  under: '欠阻尼 · 振荡衰减',
  critical: '临界阻尼 · 最快回位',
  over: '过阻尼 · 缓慢回位',
}

export default function DampedOscillationExperiment() {
  const [highlight, setHighlight] = useState<number | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(dampedOscillationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDampedOscillation(canvas, 1, 20, highlight)
  }, [highlight])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">阻尼振荡</h1>
            <p className="text-gray-600">欠阻尼 · 临界 · 过阻尼</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">位移-时间曲线 · x(0)=1, x'(0)=0</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">阻尼比 ζ</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setHighlight(undefined)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${highlight === undefined ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                >
                  三种对比
                </button>
                {ZETA_VALUES.map((z) => (
                  <button
                    key={z}
                    onClick={() => setHighlight(z)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${highlight === z ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    ζ = {z} · {TYPE_LABEL[dampingType(z)]}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关键点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 方程 <b>m x″ + c x′ + k x = 0</b>，阻尼比 ζ = c / (2√(mk))。</li>
                <li>• ζ&lt;1 <b>欠阻尼</b>：来回振荡，幅度指数衰减。</li>
                <li>• ζ=1 <b>临界阻尼</b>：不振荡且回位最快。</li>
                <li>• ζ&gt;1 <b>过阻尼</b>：不振荡但回位更慢。</li>
                <li>• 汽车悬挂、电表指针都追求临界附近的阻尼。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
