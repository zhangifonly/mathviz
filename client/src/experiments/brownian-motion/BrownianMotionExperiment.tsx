import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { brownianMotionNarration } from '../../narrations/scripts/brownian-motion'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { STEP_COUNTS, MODES, type Mode } from './brownianMotion'
import { drawBrownianMotion } from './draw'

const W = 600
const H = 480

export default function BrownianMotionExperiment() {
  const [mode, setMode] = useState<Mode>('1d')
  const [steps, setSteps] = useState(500)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(brownianMotionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBrownianMotion(canvas, mode, steps, seed)
  }, [mode, steps, seed])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">布朗运动</h1>
            <p className="text-gray-600">连续随机漫步</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{mode === '1d' ? '一维轨迹（位置-时间）' : '二维平面游走'} · {steps} 步</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">维度</h3>
              <div className="grid grid-cols-2 gap-2">
                {MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === m ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {m === '1d' ? '一维' : '二维'}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">步数</h3>
              <div className="space-y-2">
                {STEP_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setSteps(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${steps === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 步
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新随机
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每步位移是<b>高斯随机</b>增量，由 Box-Muller 生成。</li>
                <li>• 位置方差随时间<b>线性增长</b>，即 Var = t。</li>
                <li>• 轨迹处处<b>连续却不可导</b>，无限锯齿。</li>
                <li>• 爱因斯坦1905年用它证实了<b>分子存在</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
